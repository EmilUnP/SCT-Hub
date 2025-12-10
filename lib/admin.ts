import { supabase } from "./supabase";
import type { News, Training } from "@/types";

// News CRUD operations
export async function getNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getNewsById(id: string) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createNews(news: Omit<News, "id">) {
  const { data, error } = await supabase
    .from("news")
    .insert(news)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateNews(id: string, news: Partial<News>) {
  const { data, error } = await supabase
    .from("news")
    .update(news)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteNews(id: string) {
  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

// Trainings CRUD operations
export async function getTrainings() {
  const { data, error } = await supabase
    .from("trainings")
    .select("*")
    .order("date", { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getTrainingById(id: string) {
  const { data, error } = await supabase
    .from("trainings")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createTraining(training: Omit<Training, "id">) {
  const { data, error } = await supabase
    .from("trainings")
    .insert(training)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateTraining(id: string, training: Partial<Training>) {
  const { data, error } = await supabase
    .from("trainings")
    .update(training)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteTraining(id: string) {
  const { error } = await supabase
    .from("trainings")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
}

// User management operations
export async function getUsers() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserRole(id: string, role: "teacher" | "staff" | "student") {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

