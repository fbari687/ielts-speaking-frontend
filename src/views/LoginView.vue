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

const email = ref("");
const password = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.add({ severity: "warn", summary: "Warning", detail: "Please fill in all fields.", life: 3000 });
    return;
  }

  try {
    isLoading.value = true;
    const data = await authService.login({
      email: email.value,
      password: password.value,
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    toast.add({ severity: "success", summary: "Welcome Back", detail: `Logged in as ${data.user.name}`, life: 2500 });
    router.push("/dashboard");
  } catch (error) {
    const message = error.response?.data?.message || "Login failed. Invalid email or password.";
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
          <h2 class="text-2xl font-bold tracking-tight text-slate-900">Sign In</h2>
          <p class="text-xs text-slate-500">Access your IELTS speaking evaluation dashboard</p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="space-y-4 pt-2">
          <div class="space-y-1.5">
            <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-slate-600"> Email Address </label>
            <InputText id="email" v-model="email" type="email" placeholder="name@example.com" class="w-full" required />
          </div>

          <div class="space-y-1.5">
            <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-slate-600"> Password </label>
            <Password id="password" v-model="password" placeholder="Enter your password" :feedback="false" toggleMask class="w-full" inputClass="w-full" required />
          </div>

          <Button type="submit" label="Sign In" icon="pi pi-sign-in" :loading="isLoading" class="w-full mt-2" />

          <p class="text-center text-xs text-slate-600 pt-2">
            Don't have an account?
            <RouterLink to="/register" class="font-semibold text-indigo-600 hover:text-indigo-500"> Sign up </RouterLink>
          </p>
        </form>
      </template>
    </Card>
  </div>
</template>
