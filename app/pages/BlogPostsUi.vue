<template>
  <div class="container mx-auto p-6">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Пости блогу (Nuxt UI)</h1>
      <UButton icon="i-heroicons-plus" to="/admin/blog/posts/create">
        Додати пост
      </UButton>
    </div>

    <UCard>
      <UTable
        :rows="paginatedPosts"
        :columns="columns"
        :loading="pending"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Завантаження...',
        }"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'Постів не знайдено',
        }"
      >
        <template #title-data="{ row }">
          <NuxtLink
            :to="`/admin/blog/posts/${row.id}/edit`"
            class="text-primary hover:underline font-medium"
          >
            {{ row.title }}
          </NuxtLink>
        </template>

        <template #published_at-data="{ row }">
          <span class="text-gray-500 text-sm">
            {{
              row.published_at
                ? new Date(row.published_at).toLocaleDateString('uk-UA')
                : '—'
            }}
          </span>
        </template>

        <template #user-data="{ row }">
          {{ row.user?.name ?? '—' }}
        </template>

        <template #category-data="{ row }">
          <UBadge variant="soft">
            {{ row.category?.title ?? '—' }}
          </UBadge>
        </template>
      </UTable>

      <template #footer>
        <div class="flex items-center justify-between px-4 py-3">
          <span class="text-sm text-gray-500">
            Показано {{ startIndex + 1 }}–{{ endIndex }} з
            {{ posts.length }} записів
          </span>
          <UPagination
            v-model="page"
            :page-count="pageSize"
            :total="posts.length"
            :max="7"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: number
  title: string
  published_at: string | null
  user: { name: string }
  category: { title: string }
}

interface ApiResponse {
  data: Post[]
}

const columns = [
  { key: 'id', label: '#', sortable: true },
  { key: 'user', label: 'Автор' },
  { key: 'category', label: 'Категорія' },
  { key: 'title', label: 'Заголовок', sortable: true },
  { key: 'published_at', label: 'Дата публікації', sortable: true },
]

const page = ref(1)
const pageSize = 10

// useLazyFetch — не блокує SSR, дані приходять на клієнті
const { data: apiData, pending } = useLazyFetch<ApiResponse>('/api/blog/posts')

// posts завжди масив, ніколи не undefined
const posts = computed((): Post[] => apiData.value?.data ?? [])

const startIndex = computed(() => (page.value - 1) * pageSize)
const endIndex = computed(() => Math.min(startIndex.value + pageSize, posts.value.length))

const paginatedPosts = computed((): Post[] =>
  posts.value.slice(startIndex.value, endIndex.value),
)

watch(posts, () => {
  page.value = 1
})
</script>