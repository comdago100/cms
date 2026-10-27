'use client'

import { useState, useEffect, use } from 'react'
import { supabase } from '@/lib/supabase'

export default function CompanyAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = use(params)
  const companySlug = unwrappedParams.slug

  const [companyName, setCompanyName] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // 업체 정보 및 해당 업체의 제품 목록 불러오기
  const fetchData = async () => {
    // 1. 업체명 조회
    const { data: compData } = await supabase
      .from('companies')
      .select('name')
      .eq('slug', companySlug)
      .single()
    
    if (compData) {
      setCompanyName(compData.name)
    } else {
      setCompanyName(companySlug)
    }

    // 2. 해당 업체의 제품 목록 조회
    const { data: prodData, error } = await supabase
      .from('products')
      .select('*')
      .eq('company_slug', companySlug)
      .order('created_at', { ascending: false })
    
    if (!error && prodData) {
      setProducts(prodData)
    }
  }

  useEffect(() => {
    fetchData()
  }, [companySlug])

  // 제품 등록 및 이미지 업로드 함수
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return alert('제품명을 입력해주세요.')

    setLoading(true)
    let imageUrl = ''

    // 1. 이미지가 선택된 경우 수파베이스 Storage에 업로드
    if (file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${companySlug}_${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)

      if (uploadError) {
        alert('이미지 업로드 실패: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: publicURLData } = supabase.storage.from('product-images').getPublicUrl(fileName)
      imageUrl = publicURLData.publicUrl
    }

    // 2. Database에 데이터 저장 (company_slug 포함)
    const { error: insertError } = await supabase.from('products').insert([
      { 
        company_slug: companySlug, 
        title, 
        description, 
        image_url: imageUrl 
      }
    ])

    setLoading(false)

    if (insertError) {
      alert('저장 실패: ' + insertError.message)
    } else {
      alert('제품이 성공적으로 등록되었습니다!')
      setTitle('')
      setDescription('')
      setFile(null)
      fetchData()
    }
  }

  // 제품 삭제 함수
  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      alert('삭제되었습니다.')
      fetchData()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">🛠️ {companyName || companySlug} 관리자 페이지</h1>
        <p className="text-sm text-gray-500 mb-6">업체 고유 코드(Slug): <span className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-600">{companySlug}</span></p>

        {/* 제품 등록 폼 */}
        <form onSubmit={handleSubmit} className="mb-10 space-y-4 bg-gray-50 p-4 rounded-lg border">
          <h2 className="text-lg font-semibold text-gray-700">신규 제품 등록</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">제품명</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full border rounded-lg p-2 text-gray-800 bg-white" 
              placeholder="예: 정밀 기계 부품" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">제품 설명</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full border rounded-lg p-2 text-gray-800 bg-white" 
              placeholder="제품 사양 및 특징 입력" 
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">제품 사진</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </form>

        {/* 등록된 제품 목록 */}
        <h2 className="text-lg font-semibold text-gray-700 mb-4">등록된 제품 목록 ({products.length})</h2>
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between border p-4 rounded-lg bg-white shadow-sm">
              <div className="flex items-center space-x-4">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="w-16 h-16 object-cover rounded-md border" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">사진 없음</div>
                )}
                <div>
                  <h3 className="font-bold text-gray-800">{p.title}</h3>
                  <p className="text-sm text-gray-600">{p.description}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDelete(p.id)} 
                className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600 transition"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
