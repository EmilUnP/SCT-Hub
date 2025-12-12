import { supabase } from "./supabase";
import type { UserProfile } from "@/types";
import { queryCache, generateCacheKey } from "./cache";

// Request deduplication for profile queries
const pendingProfileRequests = new Map<string, Promise<UserProfile | null>>();

// Get full user profile with caching
export async function getUserProfile(userId: string, useCache: boolean = true): Promise<UserProfile | null> {
  const cacheKey = generateCacheKey("getUserProfile", { userId });
  
  // Check cache first if enabled
  if (useCache) {
    const cached = queryCache.get<UserProfile>(cacheKey);
    if (cached !== null) {
      return cached;
    }
  }

  // Check if same request is already pending (deduplication)
  if (pendingProfileRequests.has(cacheKey)) {
    return pendingProfileRequests.get(cacheKey)!;
  }

  // Execute query
  const promise = (async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        pendingProfileRequests.delete(cacheKey);
        return null;
      }

      // Cache result for 5 minutes
      if (useCache && data) {
        queryCache.set(cacheKey, data, 5 * 60 * 1000);
      }

      pendingProfileRequests.delete(cacheKey);
      return data;
    } catch (error) {
      pendingProfileRequests.delete(cacheKey);
      throw error;
    }
  })();

  pendingProfileRequests.set(cacheKey, promise);
  return promise;
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return null;
  }

  // Invalidate cache after update
  const cacheKey = generateCacheKey("getUserProfile", { userId });
  queryCache.invalidate(cacheKey);
  queryCache.invalidatePattern("getUserProfile");
  queryCache.invalidatePattern("getUsers");

  return data;
}

// Update last login (doesn't need to invalidate cache as it's not critical)
export async function updateLastLogin(userId: string): Promise<void> {
  await supabase
    .from("profiles")
    .update({ last_login: new Date().toISOString() })
    .eq("id", userId);
  
  // Optionally update cache if profile is cached
  const cacheKey = generateCacheKey("getUserProfile", { userId });
  const cached = queryCache.get<UserProfile>(cacheKey);
  if (cached) {
    queryCache.set(cacheKey, { ...cached, last_login: new Date().toISOString() }, 5 * 60 * 1000);
  }
}

