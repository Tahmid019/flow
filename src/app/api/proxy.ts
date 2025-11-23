export async function GET() {
    const res = await fetch('https://flow-8b38.onrender.com/api/latest_state/');
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}
