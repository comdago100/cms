import { supabase } from "@/lib/supabase";

export type CmsCategory = "facilities" | "products" | "technology" | "ir";

export interface CmsItem {
  id: string;
  category: CmsCategory;
  subCategory: string; // 예: 가공설비, 선박·해양 부품, 품질·환경 경영인증, 정기공시
  title: string;
  specOrMaterial?: string; // 설비 규격, 제품 재질, 인증 발급기관, 공시 출처
  qtyOrDate?: string; // 설비 수량, 인증 취득월, 공시 등록일
  maker?: string; // 설비 제조사
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

const STORAGE_KEY_PREFIX = "noksan_cms_items_";

function getLocalItems(slug: string): CmsItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${slug}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalItems(slug: string, items: CmsItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${slug}`, JSON.stringify(items));
  window.dispatchEvent(new Event("cms-updated"));
}

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes("placeholder.supabase.co"));
};

/**
 * 메타데이터를 description 문자열에 안전하게 직렬화/역직렬화하여
 * 기존 Supabase `products` 테이블 스키마(company_slug, title, description, image_url)와도 100% 호환되게 처리
 */
function encodeMeta(item: Omit<CmsItem, "id" | "createdAt">): string {
  return JSON.stringify({
    __cms_v1: true,
    category: item.category,
    subCategory: item.subCategory,
    specOrMaterial: item.specOrMaterial || "",
    qtyOrDate: item.qtyOrDate || "",
    maker: item.maker || "",
    description: item.description || "",
  });
}

function decodeRow(row: any): CmsItem {
  try {
    if (row.description && row.description.startsWith('{"__cms_v1":true')) {
      const parsed = JSON.parse(row.description);
      return {
        id: String(row.id),
        category: parsed.category || "products",
        subCategory: parsed.subCategory || "일반",
        title: row.title,
        specOrMaterial: parsed.specOrMaterial || "",
        qtyOrDate: parsed.qtyOrDate || "",
        maker: parsed.maker || "",
        description: parsed.description || "",
        imageUrl: row.image_url || "",
        createdAt: row.created_at || new Date().toISOString(),
      };
    }
  } catch {
    // 일반 텍스트인 경우 기존 제품 데이터로 취급
  }
  return {
    id: String(row.id),
    category: "products",
    subCategory: "주요 제품",
    title: row.title,
    specOrMaterial: "고객사 맞춤 재질",
    description: row.description || "",
    imageUrl: row.image_url || "",
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export async function fetchCmsItems(slug = "noksan", category?: CmsCategory): Promise<CmsItem[]> {
  const localItems = getLocalItems(slug);
  let remoteItems: CmsItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("company_slug", slug)
        .order("created_at", { ascending: false });

      if (!error && data) {
        remoteItems = data.map(decodeRow);
      }
    } catch {
      // 오프라인 또는 테이블 미생성 시 로컬 데이터 사용
    }
  }

  // 원격 데이터와 로컬 데이터 병합 (중복 id 제거)
  const mergedMap = new Map<string, CmsItem>();
  for (const item of [...remoteItems, ...localItems]) {
    mergedMap.set(item.id, item);
  }
  const all = Array.from(mergedMap.values());
  return category ? all.filter((i) => i.category === category) : all;
}

export async function createCmsItem(
  slug: string,
  input: Omit<CmsItem, "id" | "createdAt">,
  file?: File | null
): Promise<CmsItem> {
  let imageUrl = input.imageUrl || "";

  // 파일이 선택된 경우: Supabase Storage 시도 -> 실패 또는 미설정 시 Data URL 변환하여 즉시 반영
  if (file) {
    if (isSupabaseConfigured()) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${slug}_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (!uploadError) {
          const { data: publicURLData } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);
          imageUrl = publicURLData.publicUrl;
        }
      } catch {
        // fallback to data URL below
      }
    }

    if (!imageUrl) {
      imageUrl = await fileToDataUrl(file);
    }
  }

  const newItem: CmsItem = {
    ...input,
    id: `local_${Date.now()}`,
    imageUrl,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            company_slug: slug,
            title: input.title,
            description: encodeMeta(input),
            image_url: imageUrl,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return decodeRow(data);
      }
    } catch {
      // fallback to localStorage
    }
  }

  const current = getLocalItems(slug);
  saveLocalItems(slug, [newItem, ...current]);
  return newItem;
}

export async function updateCmsItem(
  slug: string,
  id: string,
  input: Omit<CmsItem, "id" | "createdAt">,
  file?: File | null
): Promise<void> {
  let imageUrl = input.imageUrl || "";
  if (file) {
    imageUrl = await fileToDataUrl(file);
  }

  if (!id.startsWith("local_") && isSupabaseConfigured()) {
    try {
      await supabase
        .from("products")
        .update({
          title: input.title,
          description: encodeMeta(input),
          image_url: imageUrl,
        })
        .eq("id", Number(id));
    } catch {
      // ignore
    }
  }

  const current = getLocalItems(slug);
  const existsInLocal = current.some((item) => item.id === id);
  if (existsInLocal) {
    const updated = current.map((item) =>
      item.id === id
        ? { ...item, ...input, imageUrl }
        : item
    );
    saveLocalItems(slug, updated);
  }
}

export async function deleteCmsItem(slug: string, id: string): Promise<void> {
  if (!id.startsWith("local_") && isSupabaseConfigured()) {
    try {
      await supabase.from("products").delete().eq("id", Number(id));
    } catch {
      // ignore
    }
  }

  const current = getLocalItems(slug);
  saveLocalItems(
    slug,
    current.filter((item) => item.id !== id)
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
