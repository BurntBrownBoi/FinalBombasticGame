package com.barryssurvival.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barryssurvival.databaseInterface.LeaderboardRepository;
import com.barryssurvival.entities.Leaderboard;

import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Service
public class LeaderboardService {

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    public Leaderboard saveLeaderboardEntry(Leaderboard entry) {
        return leaderboardRepository.save(entry);
    }

    public List<Leaderboard> getLeaderboard() {
        return leaderboardRepository.findAllByOrderByScoreDesc();
    }
}
