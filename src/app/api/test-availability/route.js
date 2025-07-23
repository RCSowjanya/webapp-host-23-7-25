export async function POST(request) {
  try {
    const { propertyId } = await request.json();
    
    // In a real implementation, you would fetch blocked dates from your database
    // based on the propertyId. For now, we'll return test data.
    const blockedDates = [
      {
        startDate: "2025-08-04T00:00:00.000Z",
        endDate: "2025-08-06T00:00:00.000Z"
      },
      {
        startDate: "2025-08-19T00:00:00.000Z", 
        endDate: "2025-08-21T00:00:00.000Z"
      }
    ];
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Test API working",
      propertyId,
      blockedDates
    }), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Test API failed" }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
} 