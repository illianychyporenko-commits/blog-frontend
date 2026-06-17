<script setup>
const route = useRoute()

const { data: post, pending, error } = await useFetch(`/api/blog/posts/${route.params.id}`)
</script>

<template>
  <div class="max-w-3xl mx-auto p-6">
    <div v-if="pending">
      Завантаження...
    </div>

    <div v-else-if="error">
      Помилка завантаження поста: {{ error.message }}
    </div>

    <div v-else-if="post?.data">
      <h1 class="text-3xl font-bold mb-2">{{ post.data.title }}</h1>

      <div class="text-sm text-gray-500 mb-4">
        Категорія: {{ post.data.category?.title }} ·
        Автор: {{ post.data.user?.name }} ·
        Опубліковано: {{ post.data.published_at }}
      </div>

      <div v-html="post.data.content_html"></div>
    </div>

    <div v-else>
      Пост не знайдено.
    </div>
  </div>
</template>
