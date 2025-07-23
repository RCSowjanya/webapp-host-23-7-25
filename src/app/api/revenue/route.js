import { fetchRevenueData } from "@/components/Models/dashboard/RevenueModel";

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await fetchRevenueData(body);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        success: false,
        data: null,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
