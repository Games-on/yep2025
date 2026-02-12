import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  @ViewChild('slidesEl', { static: true }) slidesEl?: ElementRef<HTMLDivElement>;
  @ViewChild('yt0') yt0?: ElementRef<HTMLDivElement>;
  @ViewChild('yt1') yt1?: ElementRef<HTMLDivElement>;
  @ViewChild('yt2') yt2?: ElementRef<HTMLDivElement>;

  activeSlide: 0 | 1 | 2 = 0;

  memories2025: string[] = [
    'assets/anhdep/0209.jpg',
    'assets/anhdep/0302 (2).jpg',
    'assets/anhdep/0302.jpg',
    'assets/anhdep/0402 (2).jpg',
    'assets/anhdep/0402 (3).jpg',
    'assets/anhdep/0402 (4).jpg',
    'assets/anhdep/0402.jpg',
    'assets/anhdep/0501.jpg',
    'assets/anhdep/0704.jpg',
    'assets/anhdep/0705.jpg',
    'assets/anhdep/0802.jpg',
    'assets/anhdep/1008 (2).jpg',
    'assets/anhdep/1008.jpg',
    'assets/anhdep/1301.jpg',
    'assets/anhdep/1306 (2).jpg',
    'assets/anhdep/1306.jpg',
    'assets/anhdep/1308 (2).jpg',
    'assets/anhdep/1308 (3).jpg',
    'assets/anhdep/1308.jpg',
    'assets/anhdep/1608.jpg',
    'assets/anhdep/1801.jpg',
    'assets/anhdep/2004.jpg',
    'assets/anhdep/2011.jpg',
    'assets/anhdep/2103 (2).jpg',
    'assets/anhdep/2103 (3).jpg'
  ];

  foodImages: string[] = [
    'assets/food/0110.jpg',
    'assets/food/0203.jpg',
    'assets/food/0504.jpg',
    'assets/food/0507.jpg',
    'assets/food/0509.jpg',
    'assets/food/0704.jpg',
    'assets/food/0709.jpg',
    'assets/food/0803.jpg',
    'assets/food/0811 (2).jpg',
    'assets/food/0811.jpg',
    'assets/food/1101.jpg',
    'assets/food/1108.jpg',
    'assets/food/1306 (2).jpg',
    'assets/food/1306 (3).jpg',
    'assets/food/1306.jpg',
    'assets/food/1411.jpg',
    'assets/food/1608.jpg',
    'assets/food/1611.jpg',
    'assets/food/1908.jpg',
    'assets/food/1909.jpg',
    'assets/food/1911.jpg',
    'assets/food/2103.jpg',
    'assets/food/2308.jpg',
    'assets/food/2611.jpg',
    // 'assets/food/2701.jpg'
  ];

  isPlaying: [boolean, boolean, boolean] = [false, false, false];

  // fullscreen viewer state
  viewerOpen = false;
  viewerGallery: 'memories' | 'food' = 'memories';
  viewerIndex = 0;
  private viewerTouchStartX: number | null = null;

  deeptalkPhases = [
    {
      key: 'warmup' as const,
      title: 'Khai vị',
      questions: [
        'Nếu đối phương là một món nhúng trong nồi lẩu Manwah, bạn nghĩ đối phương là món nào và tại sao ?',
        "Năm 2025 có phải là năm tuyệt vời đối với 2 bạn không?",
        "Bạn hãy kể những thành tựu của đối phương trong năm 2025",
        "Kỷ niệm 'đáng nhớ' nhất trong năm 2025 của hai đứa mà bạn vẫn còn nhớ là gì?",
      ]
    },
    {
      key: 'main' as const,
      title: 'Món chính',
      questions: [
        'Có khoảnh khắc nào bạn cảm thấy tự hào về đối phương nhất mà chưa kịp nói ra không?',
        'Nhìn lại hành trình 5 năm bên nhau, bạn thấy đối phương của phiên bản năm 22 tuổi này đã trưởng thành hơn như thế nào so với ngày đầu 2 bạn gặp gỡ?',
        'Hôm nay là bữa tiệc cuối cùng của năm 2025, điều gì bạn muốn cả hai cùng nhau thực hiện nhất trong năm 2026 ?',
        "Anh/em có nghĩ rằng thời điểm này là hợp lý để chúng mình bước đến giai đoạn tìm hiểu dưới sự chứng kiến và quan tâm của 2 bên gia đình không?"

      ]
    },
    {
      key: 'dessert' as const,
      title: 'Tráng miệng',
      questions: [
        'Em mong đợi sự thay đổi nào lớn nhất từ phía anh?',
        'Hai bạn hãy dành cho nhau những lời chúc, lời cảm ơn tốt đẹp nhất vì đã ở bên nhau trong năm 2025, và gửi kèm những lời động viên để đối phương tự tin hoàn thành mục tiêu trong năm 2026 nhé!',
        'Nếu thời gian dừng lại ngay lúc này, bạn sẽ thơm má chàng trai mà bạn yêu nhất chứ?',
      ]
    }
  ];

  phaseIndex: 0 | 1 | 2 = 0;
  currentPlayer: 1 | 2 = 1;
  currentQuestion: { phaseIndex: number; questionIndex: number; text: string; player: 1 | 2 } | null = null;
  history: { phaseIndex: number; questionIndex: number; text: string; player: 1 | 2 }[] = [];

  drawnByPhase = new Map<number, number[]>();

  // sequential progress per phase (no random)
  phaseProgress: [number, number, number] = [0, 0, 0];

  // thank-you state
  showThankYouButton = false;
  showThankYouContent = false;

  private ytPlayers: Array<any | null> = [null, null, null];
  private ytReady = false;

  // slide 1: Tớ thích cậu, slide 3: Em đã biết (ItRExComFJ4), slide 2: no music
  readonly youtubeVideoIds: [string, string, string] = ['S1Tq2LazfXQ', '', 'ItRExComFJ4'];

  onScroll() {
    const el = this.slidesEl?.nativeElement;
    if (!el) return;
    const slide = Math.round(el.scrollLeft / el.clientWidth);
    this.activeSlide = (Math.max(0, Math.min(2, slide)) as 0 | 1 | 2);
  }

  scrollToSlide(slide: 0 | 1 | 2) {
    const el = this.slidesEl?.nativeElement;
    if (!el) return;
    el.scrollTo({ left: slide * el.clientWidth, behavior: 'smooth' });
  }

  openViewer(which: 'memories' | 'food', index: number) {
    this.viewerGallery = which;
    this.viewerIndex = index;
    this.viewerOpen = true;
  }

  closeViewer() {
    this.viewerOpen = false;
  }

  nextViewer() {
    const list = this.viewerGallery === 'memories' ? this.memories2025 : this.foodImages;
    if (!list.length) return;
    this.viewerIndex = (this.viewerIndex + 1) % list.length;
  }

  prevViewer() {
    const list = this.viewerGallery === 'memories' ? this.memories2025 : this.foodImages;
    if (!list.length) return;
    this.viewerIndex = (this.viewerIndex - 1 + list.length) % list.length;
  }

  onViewerTouchStart(ev: TouchEvent) {
    if (ev.touches.length !== 1) return;
    this.viewerTouchStartX = ev.touches[0].clientX;
  }

  onViewerTouchEnd(ev: TouchEvent) {
    if (this.viewerTouchStartX === null) return;
    const dx = ev.changedTouches[0].clientX - this.viewerTouchStartX;
    this.viewerTouchStartX = null;
    const threshold = 40;
    if (dx < -threshold) this.nextViewer();
    else if (dx > threshold) this.prevViewer();
  }

  private loadYouTubeApi(): Promise<void> {
    if ((window as any).YT?.Player) return Promise.resolve();

    return new Promise((resolve) => {
      const w = window as any;
      const prev = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        if (typeof prev === 'function') prev();
        resolve();
      };

      const existing = document.querySelector('script[data-yt-iframe-api="true"]');
      if (existing) return;

      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      tag.dataset['ytIframeApi'] = 'true';
      document.head.appendChild(tag);
    });
  }

  async ngAfterViewInit() {
    await this.loadYouTubeApi();
    this.ytReady = true;
    this.initPlayers();
  }

  private initPlayers() {
    if (!this.ytReady) return;
    const YT = (window as any).YT;
    if (!YT?.Player) return;

    const els: Array<ElementRef<HTMLDivElement> | undefined> = [this.yt0, this.yt1, this.yt2];
    (['0', '2'] as const).forEach((s) => {
      const i = Number(s) as 0 | 2;
      const el = els[i]?.nativeElement;

      if (!el) return;
      if (this.ytPlayers[i]) return;

      this.ytPlayers[i] = new YT.Player(el, {
        width: '0',
        height: '0',
        videoId: this.youtubeVideoIds[i],
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          playsinline: 1
        },
        events: {
          onStateChange: (ev: any) => {
            const isPlaying = ev?.data === YT.PlayerState.PLAYING;
            this.isPlaying[i] = isPlaying;
            if (isPlaying) {
              (['0', '1', '2'] as const).forEach((t) => {
                const j = Number(t) as 0 | 1 | 2;
                if (j === i) return;
                this.pauseYoutube(j);
              });
            }
          }
        }
      });
    });
  }

  toggleYoutube(slide: 0 | 1 | 2) {
    if (!this.ytReady) {
      return;
    }

    // đảm bảo player đã được khởi tạo (nhất là trên mobile, API load chậm)
    if (!this.ytPlayers[slide]) {
      this.initPlayers();
    }

    const p = this.ytPlayers[slide];
    if (!p) return;

    if (this.isPlaying[slide]) {
      this.pauseYoutube(slide);
    } else {
      this.playYoutube(slide);
    }
  }

  private playYoutube(slide: 0 | 1 | 2) {
    const p = this.ytPlayers[slide];
    if (!p) return;
    try {
      p.playVideo();
    } catch {
      return;
    }
  }

  private pauseYoutube(slide: 0 | 1 | 2) {
    const p = this.ytPlayers[slide];
    if (!p) return;
    try {
      p.pauseVideo();
    } catch {
      return;
    }
    this.isPlaying[slide] = false;
  }

  setPhase(idx: 0 | 1 | 2) {
    this.phaseIndex = idx;
    this.currentQuestion = null;
  }

  drawQuestion() {
    if (this.showThankYouButton || this.showThankYouContent) {
      return;
    }

    const phase = this.deeptalkPhases[this.phaseIndex];
    const progressIndex = this.phaseProgress[this.phaseIndex];

    // nếu phase hiện tại đã hết câu hỏi, chuyển sang phase tiếp theo
    if (progressIndex >= phase.questions.length) {
      if (this.phaseIndex < 2) {
        this.phaseIndex = ((this.phaseIndex + 1) as 0 | 1 | 2);
        this.drawQuestion();
      } else {
        // đã hết toàn bộ câu hỏi
        this.currentQuestion = null;
        this.showThankYouButton = true;
      }
      return;
    }

    const picked = progressIndex;

    const entry = {
      phaseIndex: this.phaseIndex,
      questionIndex: picked,
      text: phase.questions[picked],
      player: this.currentPlayer
    };

    this.currentQuestion = entry;
    this.history = [entry, ...this.history];
    const drawn = this.drawnByPhase.get(this.phaseIndex) ?? [];
    this.drawnByPhase.set(this.phaseIndex, [...drawn, picked]);
    this.phaseProgress[this.phaseIndex] = progressIndex + 1;
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  resetDraw() {
    this.drawnByPhase = new Map<number, number[]>();
    this.phaseIndex = 0;
    this.currentPlayer = 1;
    this.currentQuestion = null;
    this.history = [];
    this.phaseProgress = [0, 0, 0];
    this.showThankYouButton = false;
    this.showThankYouContent = false;
  }

  getPhaseDrawnCount(idx: 0 | 1 | 2): number {
    return this.phaseProgress[idx];
  }

  getPhaseTotal(idx: 0 | 1 | 2): number {
    return this.deeptalkPhases[idx].questions.length;
  }

  onShowThankYou() {
    this.showThankYouContent = true;
  }

  closeThankYou() {
    this.showThankYouContent = false;
  }

  ngOnDestroy(): void {
    (['0', '1', '2'] as const).forEach((s) => {
      const i = Number(s) as 0 | 1 | 2;
      const p = this.ytPlayers[i];
      if (p?.destroy) p.destroy();
    });
  }
}