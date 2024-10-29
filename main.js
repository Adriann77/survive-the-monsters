import './style.css';
import Phaser from 'phaser';

const sizes = {
  width: 600,
  height: 300,
};

const config = {
  type: Phaser.AUTO,
  width: sizes.width,
  height: sizes.height,
  backgroundColor: '#333',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  parent: 'gameContainer',
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('mountains', '/assets/layer4.png');
  this.load.image('moon', '/assets/moon.png');
  this.load.spritesheet('dude_kick', '/assets/dude/Sheet_Kick.png', {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet('dude_run', '/assets/dude/Sheet_Run.png', {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet('dude_punch', '/assets/dude/Sheet_Punch.png', {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet('dude', '/assets/dude/Sprite_Base.png', {
    frameWidth: 64,
    frameHeight: 64,
  });
}

function create() {
  const ground = this.physics.add.staticGroup();

  this.add.image(200, 240, 'mountains');
  this.add.image(350, 240, 'mountains');

  const moon = this.add.image(530, 50, 'moon');
  moon.setScale(0.3);

  this.player = this.physics.add.sprite(100, sizes.height - 100, 'dude');
  this.player.setBounce(0.2);
  this.player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'idle',
    frames: [{ key: 'dude', frame: 0 }],
    frameRate: 1,
    repeat: -1,
  });

  this.anims.create({
    key: 'run_right',
    frames: this.anims.generateFrameNumbers('dude_run', { start: 8, end: 10 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'run_left',
    frames: this.anims.generateFrameNumbers('dude_run', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'kick',
    frames: [
      { key: 'dude_kick', frame: 8 },
      { key: 'dude_kick', frame: 9 },
      { key: 'dude_kick', frame: 10 },
      { key: 'dude_kick', frame: 11 },
      { key: 'dude_kick', frame: 10 },
      { key: 'dude_kick', frame: 9 },
    ],
    frameRate: 10,
    repeat: 0,
  });

  this.anims.create({
    key: 'punch',
    frames: [
      { key: 'dude_punch', frame: 8 },
      { key: 'dude_punch', frame: 9 },
      { key: 'dude_punch', frame: 10 },
      { key: 'dude_punch', frame: 9 },
      { key: 'dude_punch', frame: 8 },
    ],
    frameRate: 10,
    repeat: 0,
  });

  this.player.play('idle');
  this.physics.add.collider(this.player, ground);

  this.cursors = this.input.keyboard.createCursorKeys();
  this.spaceKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE,
  );
  this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
  this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

  this.player.on('animationcomplete', (animation) => {
    if (animation.key === 'kick' || animation.key === 'punch') {
      this.player.play('idle');
    }
  });
}

function update() {
  const isPlayingNonInterruptibleAnim = ['kick', 'punch'].includes(
    this.player.anims.currentAnim?.key,
  );

  if (!isPlayingNonInterruptibleAnim) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = true;
      if (this.player.anims.currentAnim.key !== 'run_left') {
        this.player.play('run_left');
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.flipX = false;
      if (this.player.anims.currentAnim.key !== 'run_right') {
        this.player.play('run_right');
      }
    } else {
      this.player.setVelocityX(0);
      if (this.player.anims.currentAnim.key !== 'idle') {
        this.player.play('idle');
      }
    }
  }

  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-330);
  }

  if (
    Phaser.Input.Keyboard.JustDown(this.qKey) &&
    !isPlayingNonInterruptibleAnim
  ) {
    this.player.play('punch');
    this.player.setVelocityX(0);
  }

  if (
    Phaser.Input.Keyboard.JustDown(this.wKey) &&
    !isPlayingNonInterruptibleAnim
  ) {
    this.player.play('kick');
    this.player.setVelocityX(0);
  }

  if (
    Phaser.Input.Keyboard.JustDown(this.spaceKey) &&
    this.player.body.touching.down
  ) {
    this.player.setVelocityY(-330);
  }
}
