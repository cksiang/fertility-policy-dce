export async function onRequestPost(context) {
  try {
    const { DB } = context.env;
    const data = await context.request.json();
    
    // Fallback checks to catch both camelCase and snake_case variations seamlessly
    const subject_id = data.subjectId || data.subject_id || "UNKNOWN_SUB";
    const choice_set_id = data.choiceSetId || data.choice_set_id || "UNKNOWN_TASK";
    const selected_option = data.selectedOption || data.selected_option || "UNKNOWN_OPT";
    
    await DB.prepare(
      "INSERT INTO responses (subject_id, choice_set_id, selected_option) VALUES (?, ?, ?)"
    )
    .bind(subject_id, choice_set_id, selected_option)
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
