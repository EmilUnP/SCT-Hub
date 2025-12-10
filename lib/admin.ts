import { supabase } from "./supabase";
import type { News, Training } from "@/types";

// News CRUD operations
export async function getNews() {
  try {
    const { data, error } = await supabase
      .from("news")
      .select("id, title, excerpt, content, category, date, image, created_at, updated_at")
      .order("date", { ascending: false })
      .limit(100); // Limit results for performance
    
    if (error) {
      console.error("Supabase error in getNews:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    // Ensure we always return an array
    const result = Array.isArray(data) ? data : [];
    console.log("getNews returned:", result.length, "items");
    return result;
  } catch (error) {
    console.error("Error in getNews function:", error);
    // Return empty array instead of throwing to prevent UI crashes
    // The error is already logged above
    return [];
  }
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
  try {
    const { data, error } = await supabase
      .from("trainings")
      .select("id, title, description, category, date, duration, trainer, price, image, created_at, updated_at")
      .order("date", { ascending: true })
      .limit(100); // Limit results for performance
    
    if (error) {
      console.error("Supabase error in getTrainings:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    // Ensure we always return an array
    const result = Array.isArray(data) ? data : [];
    console.log("getTrainings returned:", result.length, "items");
    return result;
  } catch (error) {
    console.error("Error in getTrainings function:", error);
    // Return empty array instead of throwing to prevent UI crashes
    // The error is already logged above
    return [];
  }
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
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, name, role, phone, company, created_at, updated_at, last_login")
      .order("created_at", { ascending: false })
      .limit(100); // Limit results for performance
    
    if (error) {
      console.error("Supabase error in getUsers:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    // Ensure we always return an array
    const result = Array.isArray(data) ? data : [];
    console.log("getUsers returned:", result.length, "users");
    return result;
  } catch (error) {
    console.error("Error in getUsers function:", error);
    // Return empty array instead of throwing to prevent UI crashes
    // The error is already logged above
    return [];
  }
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

export async function updateUserRole(id: string, role: "teacher" | "staff" | "student" | "guest") {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

