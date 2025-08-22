package com.zerock.mreview.repository;

import com.zerock.mreview.entity.MovieImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface MovieImageRepository extends JpaRepository<MovieImage, Long> {
    @Transactional
    @Modifying
    @Query("delete from MovieImage mi where mi.movie.mno = :mno and mi.uuid = :uuid")
    int deleteByMovieAndUuid(Long mno, String uuid);
}
