import { supabase } from "./supabase";
import type { News, Training } from "@/types";
import { queryCache, generateCacheKey } from "./cache";

// Request deduplication - prevent multiple identical requests
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Execute query with caching and deduplication
 */
async function executeQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5 minutes default
): Promise<T> {
  // Check cache first
  const cached = queryCache.get<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Check if same request is already pending (deduplication)
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }

  // Execute query
  const promise = queryFn()
    .then((result) => {
      // Cache result
      queryCache.set(cacheKey, result, ttl);
      pendingRequests.delete(cacheKey);
      return result;
    })
    .catch((error) => {
      pendingRequests.delete(cacheKey);
      throw error;
    });

  pendingRequests.set(cacheKey, promise);
  return promise;
}

// News CRUD operations
export async function getNews() {
  const cacheKey = generateCacheKey("getNews");
  
  return executeQuery(cacheKey, async () => {
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
  }, 3 * 60 * 1000); // 3 minutes cache for news
}

export async function getNewsById(id: string) {
  const cacheKey = generateCacheKey("getNewsById", { id });
  
  return executeQuery(cacheKey, async () => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  }, 10 * 60 * 1000); // 10 minutes cache for individual news items
}

export async function createNews(news: Omit<News, "id">) {
  const { data, error } = await supabase
    .from("news")
    .insert(news)
    .select()
    .single();
  
  if (error) throw error;
  
  // Invalidate cache after create
  queryCache.invalidatePattern("getNews");
  queryCache.invalidate("getNews");
  
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
  
  // Invalidate cache after update
  queryCache.invalidatePattern("getNews");
  queryCache.invalidate("getNews");
  queryCache.invalidate(generateCacheKey("getNewsById", { id }));
  
  return data;
}

export async function deleteNews(id: string) {
  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  
  // Invalidate cache after delete
  queryCache.invalidatePattern("getNews");
  queryCache.invalidate("getNews");
  queryCache.invalidate(generateCacheKey("getNewsById", { id }));
}

// Trainings CRUD operations
export async function getTrainings() {
  const cacheKey = generateCacheKey("getTrainings");
  
  return executeQuery(cacheKey, async () => {
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
  }, 3 * 60 * 1000); // 3 minutes cache for trainings
}

export async function getTrainingById(id: string) {
  const cacheKey = generateCacheKey("getTrainingById", { id });
  
  return executeQuery(cacheKey, async () => {
    const { data, error } = await supabase
      .from("trainings")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  }, 10 * 60 * 1000); // 10 minutes cache for individual training items
}

export async function createTraining(training: Omit<Training, "id">) {
  const { data, error } = await supabase
    .from("trainings")
    .insert(training)
    .select()
    .single();
  
  if (error) throw error;
  
  // Invalidate cache after create
  queryCache.invalidatePattern("getTrainings");
  queryCache.invalidate("getTrainings");
  
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
  
  // Invalidate cache after update
  queryCache.invalidatePattern("getTrainings");
  queryCache.invalidate("getTrainings");
  queryCache.invalidate(generateCacheKey("getTrainingById", { id }));
  
  return data;
}

export async function deleteTraining(id: string) {
  const { error } = await supabase
    .from("trainings")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  
  // Invalidate cache after delete
  queryCache.invalidatePattern("getTrainings");
  queryCache.invalidate("getTrainings");
  queryCache.invalidate(generateCacheKey("getTrainingById", { id }));
}

// User management operations
export async function getUsers() {
  const cacheKey = generateCacheKey("getUsers");
  
  return executeQuery(cacheKey, async () => {
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
  }, 2 * 60 * 1000); // 2 minutes cache for users (shorter since user data changes more frequently)
}

export async function getUserById(id: string) {
  const cacheKey = generateCacheKey("getUserById", { id });
  
  return executeQuery(cacheKey, async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  }, 5 * 60 * 1000); // 5 minutes cache for individual users
}

export async function updateUserRole(id: string, role: "teacher" | "staff" | "student" | "guest") {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Invalidate cache after update
  queryCache.invalidatePattern("getUsers");
  queryCache.invalidate("getUsers");
  queryCache.invalidate(generateCacheKey("getUserById", { id }));
  
  return data;
}

