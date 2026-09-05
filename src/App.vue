<script setup>
import { ref, onMounted } from "vue";
import { speakingService } from "./services/speakingService";
import { useToast } from "primevue/usetoast";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import Card from "primevue/card";
import Toast from "primevue/toast";

const toast = useToast();

const questions = ref([]);
const attempts = ref([]);
const selectedQuestion = ref(null);
const userAnswer = ref("");

const isLoadingQuestions = ref(false);
const isLoadingAttempts = ref(false);
const isSubmitting = ref(false);

const isModalVisible = ref(false);
const activeAttempt = ref(null);

const fetchQuestions = async () => {
  try {
    isLoadingQuestions.value = true;
    questions.value = await speakingService.getQuestions();
  } catch (error) {
    toast.add({ severity: "error", summary: "Error", detail: "Failed to load questions.", life: 4000 });
  } finally {
    isLoadingQuestions.value = false;
  }
};

const fetchAttempts = async () => {
  try {
    isLoadingAttempts.value = true;
    attempts.value = await speakingService.getAttempts();
  } catch (error) {
    toast.add({ severity: "error", summary: "Error", detail: "Failed to load attempts.", life: 4000 });
  } finally {
    isLoadingAttempts.value = false;
  }
};

const handleSubmit = async () => {
  if (!selectedQuestion.value) {
    toast.add({ severity: "warn", summary: "Warning", detail: "Please select a question prompt.", life: 3000 });
    return;
  }

  if (!userAnswer.value.trim() || userAnswer.value.trim().length < 10) {
    toast.add({ severity: "warn", summary: "Warning", detail: "Answer must be at least 10 characters long.", life: 3000 });
    return;
  }

  try {
    isSubmitting.value = true;
    const newAttempt = await speakingService.submitAttempt({
      question_id: selectedQuestion.value.id,
      user_answer: userAnswer.value.trim(),
    });

    toast.add({ severity: "success", summary: "Success", detail: "Evaluation completed!", life: 3000 });

    userAnswer.value = "";
    selectedQuestion.value = null;
    await fetchAttempts();
    openDetailModal(newAttempt);
  } catch (error) {
    const message = error.response?.data?.message || "Submission failed. Please check backend connection.";
    toast.add({ severity: "error", summary: "Submission Failed", detail: message, life: 5000 });
  } finally {
    isSubmitting.value = false;
  }
};

const openDetailModal = (attempt) => {
  activeAttempt.value = attempt;
  isModalVisible.value = true;
};

const getScoreSeverity = (score) => {
  const numericScore = parseFloat(score);
  if (numericScore >= 7.5) return "success";
  if (numericScore >= 6.0) return "info";
  if (numericScore >= 5.0) return "warn";
  return "danger";
};

onMounted(() => {
  fetchQuestions();
  fetchAttempts();
});
</script>

<template>
  <Toast />
  <div class="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <!-- Header -->
      <header class="text-center space-y-2">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">IELTS Speaking Evaluation</h1>
        <p class="text-sm sm:text-base text-slate-500">Automated feedback and band scoring powered by Gemini AI</p>
      </header>

      <!-- Dashboard Grid Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Submission Form Panel -->
        <Card class="lg:col-span-5 shadow-sm border border-slate-200">
          <template #title>
            <span class="text-lg font-semibold text-slate-800">Submit Speaking Answer</span>
          </template>
          <template #content>
            <form @submit.prevent="handleSubmit" class="space-y-4 pt-2">
              <div class="space-y-1.5">
                <label for="question-select" class="block text-xs font-semibold uppercase tracking-wider text-slate-600"> Select Prompt </label>
                <Select id="question-select" v-model="selectedQuestion" :options="questions" optionLabel="prompt" placeholder="Choose an IELTS prompt" :loading="isLoadingQuestions" class="w-full">
                  <template #option="slotProps">
                    <div class="py-1">
                      <span class="text-xs font-bold text-indigo-600">Part {{ slotProps.option.part }} - {{ slotProps.option.topic }}</span>
                      <p class="text-sm text-slate-700 mt-0.5">{{ slotProps.option.prompt }}</p>
                    </div>
                  </template>
                </Select>
              </div>

              <div class="space-y-1.5">
                <label for="user-answer" class="block text-xs font-semibold uppercase tracking-wider text-slate-600"> Your Answer </label>
                <Textarea id="user-answer" v-model="userAnswer" rows="6" placeholder="Type or paste your speaking transcription here..." class="w-full" :disabled="isSubmitting" />
              </div>

              <Button type="submit" label="Submit for Evaluation" icon="pi pi-send" :loading="isSubmitting" class="w-full mt-2" />
            </form>
          </template>
        </Card>

        <!-- Attempts History Panel -->
        <Card class="lg:col-span-7 shadow-sm border border-slate-200">
          <template #title>
            <span class="text-lg font-semibold text-slate-800">Recent Attempts</span>
          </template>
          <template #content>
            <DataTable :value="attempts" :loading="isLoadingAttempts" responsiveLayout="scroll" emptyMessage="No speaking attempts found yet." class="pt-2 text-sm">
              <Column field="question.part" header="Part" style="width: 15%">
                <template #body="slotProps">
                  <span class="font-medium text-slate-600">Part {{ slotProps.data.question?.part || "-" }}</span>
                </template>
              </Column>
              <Column field="question.prompt" header="Question Prompt" style="width: 50%">
                <template #body="slotProps">
                  <span class="line-clamp-2 text-slate-700">{{ slotProps.data.question?.prompt }}</span>
                </template>
              </Column>
              <Column field="band_score" header="Band" style="width: 15%">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.band_score" :severity="getScoreSeverity(slotProps.data.band_score)" />
                </template>
              </Column>
              <Column header="Action" style="width: 20%">
                <template #body="slotProps">
                  <Button label="View" icon="pi pi-eye" severity="secondary" size="small" text @click="openDetailModal(slotProps.data)" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>
    </div>

    <!-- Detail Feedback Modal -->
    <Dialog v-model:visible="isModalVisible" modal header="Evaluation Report" :style="{ width: '42rem' }">
      <div v-if="activeAttempt" class="space-y-5 pt-2">
        <div class="flex items-start justify-between border-b border-slate-200 pb-4">
          <div class="space-y-1">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-600"> {{ activeAttempt.question?.topic }} (Part {{ activeAttempt.question?.part }}) </span>
            <h4 class="text-base font-semibold text-slate-900">{{ activeAttempt.question?.prompt }}</h4>
          </div>
          <div class="text-center pl-4">
            <span class="block text-xs font-semibold text-slate-400 mb-1">Band Score</span>
            <Tag :value="activeAttempt.band_score" :severity="getScoreSeverity(activeAttempt.band_score)" class="text-base px-3 py-1" />
          </div>
        </div>

        <div class="space-y-1.5">
          <h5 class="text-xs font-bold uppercase tracking-wider text-slate-500">Your Answer</h5>
          <div class="bg-slate-100 p-3 rounded border-l-4 border-slate-400 text-sm italic text-slate-700">"{{ activeAttempt.user_answer }}"</div>
        </div>

        <div class="space-y-2">
          <h5 class="text-sm font-semibold text-emerald-700 flex items-center gap-1.5"><i class="pi pi-check-circle"></i> Strengths</h5>
          <ul class="list-disc list-inside space-y-1 text-sm text-slate-700 pl-1">
            <li v-for="(item, index) in activeAttempt.strengths" :key="index">{{ item }}</li>
          </ul>
        </div>

        <div class="space-y-2">
          <h5 class="text-sm font-semibold text-amber-700 flex items-center gap-1.5"><i class="pi pi-exclamation-circle"></i> Areas to Improve</h5>
          <ul class="list-disc list-inside space-y-1 text-sm text-slate-700 pl-1">
            <li v-for="(item, index) in activeAttempt.areas_to_improve" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
    </Dialog>
  </div>
</template>
