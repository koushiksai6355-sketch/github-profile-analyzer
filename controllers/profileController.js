const axios = require('axios');
const Profile = require('../models/profileModel');

exports.analyzeProfile = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Username parameter is required" });
    }

    try {
        // 1. Fetch data from GitHub API
        const profileResponse = await axios.get(`https://api.github.com/users/${username}`);
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);

        const profileData = profileResponse.data;
        const reposData = reposResponse.data;

        // 2. Calculate Deep Insights (Stars & Languages)
        let totalStars = 0;
        const languageMap = {};

        reposData.forEach(repo => {
            totalStars += repo.stargazers_count;
            if (repo.language) {
                languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
            }
        });

        // Sort and get top 3 languages
        const topLanguages = Object.keys(languageMap)
            .sort((a, b) => languageMap[b] - languageMap[a])
            .slice(0, 3);

        // 3. Prepare payload for DB
        const insightPayload = {
            username: profileData.login,
            name: profileData.name,
            bio: profileData.bio,
            public_repos: profileData.public_repos,
            followers: profileData.followers,
            following: profileData.following,
            total_stars: totalStars,
            profile_url: profileData.html_url
        };

        // 4. Persist to MySQL
        const profileId = await Profile.saveProfile(insightPayload);
        await Profile.saveLanguages(profileId, topLanguages);

        res.status(200).json({
            message: "Profile analyzed and saved successfully!",
            data: { ...insightPayload, top_languages: topLanguages }
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: "GitHub user not found" });
        }
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getAllProfiles = async (req, res) => {
    try {
        const list = await Profile.getAll();
        res.status(200).json({ count: list.length, profiles: list });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getProfileByUsername = async (req, res) => {
    try {
        const profile = await Profile.getByUsername(req.params.username);
        if (!profile) return res.status(404).json({ error: "Profile not found in database" });
        
        res.status(200).json({ data: profile });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
