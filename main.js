const app = new Vue({
  el: '#app',
  data: {
    delay: 1500,
    mode: 'ease',
    currentInputIndex: -1,
    combination: [],
    userInput: [],
    started: false,
    allowClick: true,
    count: 0,
    greenActive: false,
    redActive: false,
    blueActive: false,
    yellowActive: false,
    bestScore: 0
  },
  watch: {
    mode(value) {
      switch(value) {
        case 'ease': {
          this.delay = 1500;
          break;
        }
        case 'normal': {
          this.delay = 1000;
          break;
        }
        case 'hard': {
          this.delay = 400;
          break;
        }
      }
      
      if (this.combination.length) {
        window.alert('Game will restart');
        this.resertGame();
      }
      console.log(this.delay);
    }
  },

  methods: {
    start(){
      this.clearHightlightClasses();
      this.allowClick = false;
      this.started = true;
      this.count++;
      this.combination.push(this.getRandomSection());
      this.playCombinationSounds();
      this.userInput = [];
    },

    playCombinationSounds(){
      let delay = this.delay;
      this.combination.forEach((section, index, array) => {
        setTimeout(() => {
          if (index === array.length - 1) {
            this.playSound(section);
            this.allowClick = true;
            return;
          }

          this.playSound(section);
        }, delay);
        delay += this.delay;
      });
    },

    inputSection(section){
      this.started && this.allowClick && this.currentInputIndex++;
      if (!this.allowClick) {
        console.log('not allow click');
        return ;
      }
      this.playSound(section);

      if (this.started) {
        this.userInput.push(section);

        if (this.userInput[this.currentInputIndex] !== this.combination[this.currentInputIndex]) {
          window.alert('You loose');
          this.bestScore = this.count > this.bestScore ? this.count : this.bestScore;
          window.localStorage.setItem('simonScore', JSON.stringify(this.count));
          this.resertGame();
          return;
        }

        if (this.userInput.length === this.combination.length) {
          setTimeout(() => {
            this.currentInputIndex = -1;
            this.start();
          }, this.delay/2);
        }
      }
    },

    getRandomSection(){
      return Math.floor(Math.random() * 4) + 1;
    },

    playSound(section){
      this.clearHightlightClasses();
      switch (section) {
        case 1: {
          this.$refs.sound1.pause();
          this.$refs.sound1.currentTime = 0;
          this.$refs.sound1.play();
          this.greenActive = true;
          break;
        }
        case 2: {
          this.$refs.sound2.pause();
          this.$refs.sound2.currentTime = 0;
          this.$refs.sound2.play();
          this.redActive = true;
          break;
        }
        case 3: {
          this.$refs.sound3.pause();
          this.$refs.sound3.currentTime = 0;
          this.$refs.sound3.play();
          this.blueActive = true;
          break;
        }
        case 4: {
          this.$refs.sound4.pause();
          this.$refs.sound4.currentTime = 0;
          this.$refs.sound4.play();
          this.yellowActive = true;
          break;
        }
      }

      setTimeout(() => {
        this.clearHightlightClasses();
      }, this.delay/4);
    },

    clearHightlightClasses(){
      this.greenActive = false;
      this.redActive = false;
      this.blueActive = false;
      this.yellowActive = false;
    },

    resertGame(){
      this.currentInputIndex = -1;
      this.combination = [];
      this.started = false;
      this.allowClick = true;
      this.count = 0;
      this.clearHightlightClasses();
    }
  },

  mounted(){
    this.bestScore = JSON.parse(window.localStorage.getItem('simonScore')) || 0;
  }
});