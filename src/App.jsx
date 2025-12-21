// Change the function signature to accept arguments
  const generateAll = async (selectedSplit, selectedLevel) => {
    setLoading(true);
    setWorkout(null);
    setPlaylistUrl(null);

    try {
      // 1. Generate Workout with dynamic parameters
      // Note: We use the arguments passed from Hero, not hardcoded strings
      const workoutRes = await fetch(
        `${BACKEND}/workout?split=${selectedSplit}&level=${selectedLevel}`
      );
      
      if (!workoutRes.ok) throw new Error("Failed to fetch workout");
      
      const workoutData = await workoutRes.json();
      setWorkout(workoutData);

      // 2. Generate Playlist
      const playlistRes = await fetch(`${BACKEND}/playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalSeconds: workoutData.totalSeconds }),
      });
      
      const playlistData = await playlistRes.json();
      setPlaylistUrl(playlistData.playlistUrl);
    
    } catch (error) {
      console.error("Error generating:", error);
      alert("Error! Ensure Backend is running and RapidAPI key is valid.");
    }
    setLoading(false);
  };
