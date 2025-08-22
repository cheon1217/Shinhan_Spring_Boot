package com.zerock.mreview.controller;

import com.zerock.mreview.dto.MovieDTO;
import com.zerock.mreview.dto.MovieImageDTO;
import com.zerock.mreview.dto.PageRequestDTO;
import com.zerock.mreview.service.MovieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/movie")
@Log4j2
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    @GetMapping("/register")
    public void register() {

    }

    @PostMapping("/register")
    public String register(MovieDTO movieDTO, RedirectAttributes redirectAttributes) {
        log.info("movieDTO: " + movieDTO);

        Long mno = movieService.register(movieDTO);

        redirectAttributes.addFlashAttribute("msg", mno);

        return "redirect:/movie/list";
    }

    @GetMapping("/list")
    public void list(PageRequestDTO pageRequestDTO, Model model) {
        log.info("pageRequestDTO: " + pageRequestDTO);
        model.addAttribute("result", movieService.getList(pageRequestDTO));
    }

    @GetMapping({"/read", "/modify"})
    public void read(long mno, @ModelAttribute("requestDTO") PageRequestDTO requestDTO, Model model) {

        log.info("mno: " + mno);

        MovieDTO movieDTO = movieService.getMovie(mno);

        model.addAttribute("dto", movieDTO);

    }

    @PostMapping("/{mno}/images")
    public ResponseEntity<Void> addImagesToMovie(@PathVariable("mno") Long mno,
                                                 @RequestBody List<MovieImageDTO> images) {
        log.info("add images to movie mno={}, images={}", mno, images);
        movieService.addImages(mno, images);
        return ResponseEntity.ok().build();
    }

    // ★ 이미지 연결 해제(삭제)
    @PostMapping("/{mno}/images/{uuid}/delete") // (PUT/DELETE가 막혀있는 환경 고려해 POST로 구성)
    public ResponseEntity<Boolean> removeImageFromMovie(@PathVariable("mno") Long mno,
                                                        @PathVariable("uuid") String uuid) {
        log.info("remove image from movie mno={}, uuid={}", mno, uuid);
        boolean ok = movieService.removeImage(mno, uuid);
        return ResponseEntity.ok(ok);
    }
}
