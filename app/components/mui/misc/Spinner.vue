<template>
  <div class="spinner-container">
    <div class="spinner"></div>
  </div>

</template>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--color-secondary); 
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>