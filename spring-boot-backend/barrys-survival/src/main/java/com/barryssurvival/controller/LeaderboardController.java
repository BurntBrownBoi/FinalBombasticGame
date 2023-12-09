package com.barryssurvival.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.barryssurvival.entities.Leaderboard;
import com.barryssurvival.service.LeaderboardService;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private LeaderboardService leaderboardService;

    @CrossOrigin(origins = "*")
    @PostMapping
    public ResponseEntity<Leaderboard> addEntry(@RequestBody Leaderboard entry) {
        System.out.println(entry);
        return ResponseEntity.ok(leaderboardService.saveLeaderboardEntry(entry));
    }

    @CrossOrigin(origins = "*")
    @GetMapping
    public ResponseEntity<List<Leaderboard>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }

}
