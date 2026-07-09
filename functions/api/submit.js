export async function onRequestPost(context) {
  try {
    const { DB } = context.env;
    const { subjectId, choiceSetId, selectedOption } = await context.request.json();
    
    await DB.prepare(
      "INSERT INTO responses (subject_id, choice_set_id, selected_option) VALUES (?, ?, ?)"
    )
    .bind(subjectId, choiceSetId, selectedOption)
    .run();
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
