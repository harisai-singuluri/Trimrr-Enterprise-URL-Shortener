package com.urlshortener.repository;

import com.urlshortener.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortUrl(String shortUrl);
    Optional<Url> findByCustomUrl(String customUrl);

    @Query("SELECT u FROM Url u WHERE u.shortUrl = :code OR u.customUrl = :code")
    Optional<Url> findByShortUrlOrCustomUrl(@Param("code") String code);

    List<Url> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByShortUrl(String shortUrl);
    boolean existsByCustomUrl(String customUrl);
}
