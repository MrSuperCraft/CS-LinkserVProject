async function applyPreset(presetObject) {
    try {
        const userId = await getUserIdWithFallback(); // Get the user ID

        const response = await fetch(`/api/apply-preset/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ presetData: presetObject })
        });

        if (!response.ok) {
            throw new Error('Error applying preset');
        }

        // Handle successful response if needed
        console.log('Preset applied successfully');
        showMessage("Preset applied successfully", 'success');
        window.location.reload();
    } catch (error) {
        console.error('Error applying preset:', error);
    }
}
