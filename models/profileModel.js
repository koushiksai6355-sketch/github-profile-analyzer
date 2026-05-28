const db = require('../config/db');

const Profile = {
    // Upsert profile data (Insert or Update on duplicate username)
    saveProfile: async (data) => {
        const query = `
            INSERT INTO github_profiles (username, name, bio, public_repos, followers, following, total_stars, profile_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                bio = VALUES(bio),
                public_repos = VALUES(public_repos),
                followers = VALUES(followers),
                following = VALUES(following),
                total_stars = VALUES(total_stars),
                profile_url = VALUES(profile_url);
        `;
        const values = [data.username, data.name, data.bio, data.public_repos, data.followers, data.following, data.total_stars, data.profile_url];
        const [result] = await db.execute(query, values);
        
        // If updated, we need to find the ID. If inserted, it's insertId.
        if (result.insertId) return result.insertId;
        
        const [rows] = await db.execute('SELECT id FROM github_profiles WHERE username = ?', [data.username]);
        return rows[0].id;
    },

    saveLanguages: async (profileId, languages) => {
        // Clear old languages first to keep it fresh
        await db.execute('DELETE FROM profile_languages WHERE profile_id = ?', [profileId]);
        
        if (languages.length === 0) return;
        
        const query = 'INSERT INTO profile_languages (profile_id, language) VALUES ?';
        const values = languages.map(lang => [profileId, lang]);
        await db.query(query, [values]);
    },

    getAll: async () => {
        const [rows] = await db.execute('SELECT id, username, name, public_repos, followers, total_stars FROM github_profiles ORDER BY created_at DESC');
        return rows;
    },

    getByUsername: async (username) => {
        const [profile] = await db.execute('SELECT * FROM github_profiles WHERE username = ?', [username]);
        if (profile.length === 0) return null;

        const [langs] = await db.execute('SELECT language FROM profile_languages WHERE profile_id = ?', [profile[0].id]);
        profile[0].top_languages = langs.map(l => l.language);
        
        return profile[0];
    }
};

module.exports = Profile;
