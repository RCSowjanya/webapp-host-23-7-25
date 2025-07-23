"use server";
import { auth } from "@/app/(dashboard-screens)/auth";
import api from "@/utils/apiService";

export async function GET() {
  try {
    const session = await auth();
    const token = session?.token;
    
    if (!token) {
      return new Response(JSON.stringify({ error: "No token" }), { status: 401 });
    }
    
    const response = await api.get("/property/list", {
      authorizationHeader: `Bearer ${token}`,
    });
    
    return new Response(JSON.stringify(response?.data || []), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("Property list API error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch properties" }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}
