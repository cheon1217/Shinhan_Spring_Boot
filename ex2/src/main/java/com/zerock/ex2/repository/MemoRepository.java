package com.zerock.ex2.repository;

import com.zerock.ex2.entity.Memo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MemoRepository extends JpaRepository<Memo, Long>, QuerydslPredicateExecutor<Memo> {

    List<Memo> findByMnoBetweenOrderByMnoDesc(Long from, Long to);

    Page<Memo> findByMnoBetween(Long from, Long to, Pageable pageable);

    void deleteMemoByMnoLessThan(Long mno);

    @Query("SELECT m from Memo m order by m.mno desc ")
    List<Memo> findByMemoText(@Param("memo") String memo);

    List<Memo> findByMemoTextContaining(String memo);

    @Query(value = "select * from tbl_memo where memo_text like concat('%', ?1, '%')", nativeQuery = true)
    List<Memo> selectTblMemo(String memo);
}
