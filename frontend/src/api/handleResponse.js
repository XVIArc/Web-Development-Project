    const text = await res.text();
    if (!text.trim()) {
        throw new Error(
            `Empty response from server (HTTP ${res.status}). Is the backend running on port 5001?`,
        );
    }
    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(
            `Server did not return JSON (HTTP ${res.status}). On macOS, port 5000 is often used by AirPlay — use port 5001.`,
        );
    }
    if (!data.success) throw new Error(data.error || "Something went wrong");
    return data.data;
}
