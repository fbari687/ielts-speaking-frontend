<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "../services/authService";
import { useToast } from "primevue/usetoast";

import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";

const router = useRouter();
const toast = useToast();

const name = ref("");
const email = ref("");
const password = ref("");
const passwordConfirmation = ref("");
const isLoading = ref(false);

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value || !passwordConfirmation.value) {
    toast.add({ severity: "warn", summary: "Warning", detail: "Please fill in all fields.", life: 3000 });
    return;
  }

  if (password.value !== passwordConfirmation.value) {
    toast.add({ severity: "warn", summary: "Warning", detail: "Passwords do not match.", life: 3000 });
    return;
  }

  try {
    isLoading.value = true;
    const data = await authService.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.add({ severity: "success", summary: "Account Created", detail: "Welcome aboard!", life: 2500 });
    router.push("/dashboard");
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed. Check your input.";
    toast.add({ severity: "error", summary: "Error", detail: message, life: 4000 });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4">
    <Card class="w-full max-w-md shadow-sm border border-slate-200">
      <template #title>
        <div class="text-center space-y-1">
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Create Account</h2>
          <p class="text-xs text-slate-500">Sign up to record and track your speaking attempts</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="space-y-4 pt-2">
          <div class="space-y-1.5">
            <label for="name" class="block text-xs font-semibold uppercase tracking-wider text-slate-600"> Full Name </label>
            <InputText id="name" v-model="name" type="text" placeholder="John Doe" class="w-full" required />
          </div>

          <div class="space-y-1.5">
            <label for="reg-email" class="block text-xs font-semibold uppercase tracking-wider text-slate-600"> Email Address </label>
            <InputText id="reg-email" v-model="email" type="email" placeholder="name@example.com" class="w-full" required />
          </div>

          <div class="space-y-1.5">
            <label for="reg-password" class="block text-xs font-semibold uppercase tracking-wider text-slate-600"> Password (Min. 8 chars) </label>
            <Password id="reg-password" v-model="password" placeholder="Create password" toggleMask class="w-full" inputClass="w-full" required />
          </div>

          <div class="space-y-1.5">
            <label for="password-confirmation" class="block text-xs font-semibold uppercase tracking-wider text-slate-600"> Confirm Password </label>
            <Password id="password-confirmation" v-model="passwordConfirmation" placeholder="Re-enter password" :feedback="false" toggleMask class="w-full" inputClass="w-full" required />
          </div>

          <Button type="submit" label="Create Account" icon="pi pi-user-plus" :loading="isLoading" class="w-full mt-2" />

          <p class="text-center text-xs text-slate-600 pt-2">
            Already have an account?
            <RouterLink to="/login" class="font-semibold text-indigo-600 hover:text-indigo-500"> Sign in </RouterLink>
          </p>
        </form>
      </template>
    </Card>
  </div>
</template>
