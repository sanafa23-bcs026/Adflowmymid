export async function POST(request) {
  try {
    const data = await request.json();

    return Response.json({
      success: true,
      message: "Auth ads API working",
      data,
    });

  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}