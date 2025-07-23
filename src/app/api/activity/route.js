import { fetchUserActivity } from "@/components/Models/dashboard/ActivityModel";

export async function GET(req) {
  const result = await fetchUserActivity();
  // Always return an array for data
  let arrayData = Array.isArray(result.data)
    ? result.data
    : result.data && Array.isArray(result.data.data)
    ? result.data.data
    : [];
  return Response.json({
    ...result,
    data: arrayData,
  });
}
