package com.urlshortener.repository;

import com.urlshortener.entity.Click;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClickRepository extends JpaRepository<Click, Long> {
    List<Click> findAllByUrlIdOrderByCreatedAtDesc(Long urlId);
    List<Click> findAllByUrlIdIn(List<Long> urlIds);
}
