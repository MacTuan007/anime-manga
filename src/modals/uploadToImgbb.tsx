export async function uploadToImgbb(file: File, apiKey: string): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error("Upload thất bại: " + data?.error?.message || "Unknown error");
    }

    return data.data.url;
}
