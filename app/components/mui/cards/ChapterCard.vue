<template>
    <div class="chap-card card">
        <div class="chap-number"><h3>{{ props.chapterNumber }}</h3></div>
        <div class="content">
            <div class="chap-title">{{ props.title }}</div>
            <div class="details">
                <span class="word-count"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.8492 11.805L17.1421 11.0979L7.24264 20.9974H3V16.7547L14.3137 5.44101L19.9706 11.0979C20.3611 11.4884 20.3611 12.1216 19.9706 12.5121L12.8995 19.5831L11.4853 18.1689L17.8492 11.805ZM18.5563 2.61258L21.3848 5.44101C21.7753 5.83153 21.7753 6.4647 21.3848 6.85522L19.9706 8.26943L15.7279 4.02679L17.1421 2.61258C17.5327 2.22206 18.1658 2.22206 18.5563 2.61258Z"></path></svg>{{ formattedWordCount }}</span>
                <span class="chap-price"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14.0049 2.00281C18.4232 2.00281 22.0049 5.58453 22.0049 10.0028C22.0049 13.2474 20.0733 16.0409 17.2973 17.296C16.0422 20.0718 13.249 22.0028 10.0049 22.0028C5.5866 22.0028 2.00488 18.4211 2.00488 14.0028C2.00488 10.7587 3.9359 7.96554 6.71122 6.71012C7.96681 3.93438 10.7603 2.00281 14.0049 2.00281ZM11.0049 9.00281H9.00488V10.0028C7.62417 10.0028 6.50488 11.1221 6.50488 12.5028C6.50488 13.8283 7.53642 14.9128 8.84051 14.9975L9.00488 15.0028H11.0049L11.0948 15.0109C11.328 15.0532 11.5049 15.2573 11.5049 15.5028C11.5049 15.7483 11.328 15.9524 11.0948 15.9948L11.0049 16.0028H7.00488V18.0028H9.00488V19.0028H11.0049V18.0028C12.3856 18.0028 13.5049 16.8835 13.5049 15.5028C13.5049 14.1773 12.4733 13.0928 11.1693 13.0081L11.0049 13.0028H9.00488L8.91501 12.9948C8.68176 12.9524 8.50488 12.7483 8.50488 12.5028C8.50488 12.2573 8.68176 12.0532 8.91501 12.0109L9.00488 12.0028H13.0049V10.0028H11.0049V9.00281ZM14.0049 4.00281C12.2214 4.00281 10.6196 4.78097 9.52064 6.01629C9.68133 6.00764 9.84254 6.00281 10.0049 6.00281C14.4232 6.00281 18.0049 9.58453 18.0049 14.0028C18.0049 14.1655 18 14.327 17.9905 14.4873C19.2265 13.3885 20.0049 11.7866 20.0049 10.0028C20.0049 6.6891 17.3186 4.00281 14.0049 4.00281Z"></path></svg>{{ props.chapterPrice }}</span>
                <span class="read-time"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 12V7H11V14H17V12H13Z"></path></svg>{{ props.readTime }}</span>
            </div>
            <div class="read">
                <nuxt-link :to="``">Read <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg>
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    chapterNumber: {
        type: Number,
        required: true
    },
    wordCount: {
        type: Number,
        required: true
    },
    readTime: {
        type: Number,
        required: true
    },
    chapterPrice: {
        type: [Number, String],
        required: true
    }
})

const formattedWordCount = computed(() => {
    if (typeof props.wordCount !== 'number') {
        return props.wordCount;
    }

    const formatter = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1
    });

    return formatter.format(props.wordCount);
});
</script>

<style scoped>
@reference "tailwindcss";

.chap-card{
    @apply max-w-[max-content] flex-row py-0 border-transparent
}
.chap-card:hover{
    transform: translateY(-5px);
    @apply border-red-200 bg-red-200
}
.chap-number{
    h3{
        @apply bg-red-100 text-[var(--color-secondary)] rounded-full text-center h-8 w-8 text-xl p-0.5
    }
    @apply text-4xl font-bold flex items-center justify-center 
}
.content{
    .chap-title{
        @apply font-semibold  text-lg border-b border-gray-300
    }
    .details{
        @apply flex items-center justify-center gap-2 text-[15px] text-gray-500 
    }
    .details > span{
        *{
            @apply inline-block h-5 w-5 mb-0.5
        }
        @apply flex items-center gap-0.5
    }
    @apply flex flex-col gap-2
}
.read{
    a{
        *{
            @apply h-5 w-5
        }
        @apply p-1 rounded-lg inline-flex items-center justify-center text-[var(--color-secondary)]
    }
    @apply text-end border-t border-gray-300
}
</style>