<template>
  <div class="container">
    <div class="flex justify-center">
      <div class="w-full">
        <nav class="navbar bg-gray-100 p-4 mb-4">
          <a href="/admin/blog/posts/create">Додати</a>
        </nav>

        <div v-if="loading" class="text-center py-8">Завантаження...</div>

        <div v-else-if="error" class="text-red-500 py-4">
          Помилка: {{ error }}
        </div>

        <div v-else class="card">
          <div class="card-body overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Автор</th>
                  <th>Категорія</th>
                  <th>Заголовок</th>
                  <th>Дата публікації</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="post in posts" :key="post.id">
                  <td>{{ post.id }}</td>
                  <td>{{ post.user?.name ?? '—' }}</td>
                  <td>{{ post.category?.title ?? '—' }}</td>
                  <td>
                    <a :href="'/admin/blog/posts/' + post.id + '/edit'">
                      {{ post.title }}
                    </a>
                  </td>
                  <td>{{ post.published_at ?? '—' }}</td>
                </tr>
                <tr v-if="posts.length === 0">
                  <td colspan="5" class="text-center py-4">Записів немає</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
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

const posts = ref<Post[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const getPosts = async (): Promise<void> => {
  loading.value = true
  error.value = null
  try {
    const response = await $fetch<{ data: Post[] }>('/api/blog/posts')
    posts.value = response?.data ?? []
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Невідома помилка'
    posts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(getPosts) // ← тільки клієнт, SSR не чіпає
</script>