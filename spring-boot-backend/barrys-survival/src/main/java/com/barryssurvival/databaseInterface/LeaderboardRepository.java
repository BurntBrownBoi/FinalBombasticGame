package com.barryssurvival.databaseInterface;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barryssurvival.entities.Leaderboard;

@Repository
public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {

    List<Leaderboard> findAllByOrderByScoreDesc();

}
