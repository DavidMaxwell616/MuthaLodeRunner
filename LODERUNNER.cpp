// Loderunner clone
//don't forget to include ddraw.lib	& Gpdumb1.cpp


// INCLUDES ///////////////////////////////////////////////

#define WIN32_LEAN_AND_MEAN  

#include <windows.h>   // include important windows stuff
#include <windowsx.h> 
#include <mmsystem.h>
#include <iostream.h> // include important C/C++ stuff
#include <conio.h>
#include <stdlib.h>
#include <malloc.h>
#include <memory.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h> 
#include <math.h>
#include <io.h>
#include <fcntl.h>

#include <ddraw.h>  // directX includes
#include "gpdumb1.h"

// DEFINES ////////////////////////////////////////////////

// defines for windows 
#define WINDOW_CLASS_NAME "WINXCLASS"  // class name
#define PI 3.1415926

#define WINDOW_WIDTH    64   // size of window
#define WINDOW_HEIGHT   48
#define BACKGROUND_WIDTH    32   // size of window
#define BACKGROUND_HEIGHT   24
#define MAX_BACKGROUND      200
#define MAX_MONKS 7
#define START_LEVEL   1
#define MAX_MELTING_BLOCKS 4
#define ON            1
#define OFF           0

#define EMPTY         0
#define FLOOR         1
#define LADDER        2
#define ROPE          3
#define GOLD          4
#define SOLID_FLOOR   5
#define MELT_BLOCK    6

#define STILL         0
#define RIGHT         1
#define LEFT          2
#define UP            3
#define DOWN          4
#define FALLING       5
#define BLAST_LEFT    6
#define BLAST_RIGHT   7
#define ROPE_RIGHT    8
#define ROPE_LEFT     9
#define TRAPPED       10
// PROTOTYPES /////////////////////////////////////////////

// game console
int Game_Init(void *parms=NULL);
int Game_Shutdown(void *parms=NULL);
int Game_Main(void *parms=NULL);

void NewGame(void);
int Game_Intro(void);

// GLOBALS ////////////////////////////////////////////////

HWND main_window_handle           = NULL; // save the window handle
HINSTANCE main_instance           = NULL; // save the instance
HPEN blue_pen, black_pen;       // pens to draw with

char buffer[80];                // used to print text
int forcefall=0;
int round=0;
int level=START_LEVEL;
int men_left=5;
int intro_state=0;
int gameover=0;
int beingkilled=0;
int seq_melt_block1=0,seq_melt_block2=5;
int blast_count;
int melt_block_used;
int delay;
int melt_counter;
int monk_moving[MAX_MONKS],monk_x[MAX_MONKS],monk_y[MAX_MONKS];
int monk_x_block[MAX_MONKS],monk_y_block[MAX_MONKS];
int start_level,turn=0;		//start from level selected under options
int map[BACKGROUND_WIDTH][BACKGROUND_HEIGHT];		//map
int player_x,player_y,player_moving=LEFT;
int player_x_block, player_y_block;	//location of the block
volatile int timer;		//timer of the game
int round2;
int blast;
int speed;				//speed of the game
int score, dels;		//game score and number of rows deleted
int high_score;
int melt_block_x_block[5],melt_block_y_block[5];
int num_monks=3;
int numgold=5;
int numblocks,index,blockcount;
int seq_right=11,seq_left=0,seq_falling=42,seq_climb=22;
int seq_rope_right=30,seq_rope_left=36;
int seq_left_blast=0,seq_right_blast=9;
int seq_monk_left=10,seq_monk_right=0,seq_monk_fall=20,seq_monk_climb=24;
int seq_monk_rope_right=42,seq_monk_rope_left=32;
int seq_killing1,seq_killing2=5;
BOB background[MAX_BACKGROUND];
BOB melting_block[5];
BOB monk[MAX_MONKS];
BOB player,player_blasting;
BOB killing;
BITMAP_IMAGE title;
// FUNCTIONS //////////////////////////////////////////////
LRESULT CALLBACK WindowProc(HWND hwnd, 
						    UINT msg, 
                            WPARAM wparam, 
                            LPARAM lparam)
{
// this is the main message handler of the system

// what is the message 
switch(msg)
	{	
	case WM_CREATE: 
        {
		// do initialization stuff here
		return(0);
		} break;

    case WM_PAINT:
         {
         // start painting
    //     hdc = BeginPaint(hwnd,&ps);

         // end painting
//         EndPaint(hwnd,&ps);
         return(0);
        } break;

	case WM_DESTROY: 
		{
		// kill the application			
		PostQuitMessage(0);
		return(0);
		} break;

	default:break;

    } // end switch

// process any messages that we didn't take care of 
return (DefWindowProc(hwnd, msg, wparam, lparam));
//hdc = GetDC(hwnd);

} // end WinProc

// WINMAIN ////////////////////////////////////////////////

int WINAPI WinMain(	HINSTANCE hinstance,
					HINSTANCE hprevinstance,
					LPSTR lpcmdline,
					int ncmdshow)
{
// this is the winmain function

WNDCLASS winclass;	// this will hold the class we create
HWND	 hwnd;		// generic window handle
MSG		 msg;		// generic message


// first fill in the window class stucture
winclass.style			= CS_DBLCLKS | CS_OWNDC | 
                          CS_HREDRAW | CS_VREDRAW;
winclass.lpfnWndProc	= WindowProc;
winclass.cbClsExtra		= 0;
winclass.cbWndExtra		= 0;
winclass.hInstance		= hinstance;
winclass.hIcon			= LoadIcon(NULL, IDI_APPLICATION);
winclass.hCursor		= LoadCursor(NULL, IDC_ARROW);
winclass.hbrBackground	= GetStockObject(BLACK_BRUSH);
winclass.lpszMenuName	= NULL; 
winclass.lpszClassName	= WINDOW_CLASS_NAME;

// register the window class
if (!RegisterClass(&winclass))
	return(0);

// create the window, note the use of WS_POPUP
if (!(hwnd = CreateWindow(WINDOW_CLASS_NAME, // class
						  "WinX Game Console",	 // title
						  WS_POPUP | WS_VISIBLE,
					 	  0,0,	   // x,y
						  WINDOW_WIDTH,  // width
                          WINDOW_HEIGHT, // height
						  NULL,	   // handle to parent 
						  NULL,	   // handle to menu
						  hinstance,// instance
						  NULL)))	// creation parms
return(0);

// save the window handle and instance in a global
main_window_handle = hwnd;
main_instance      = hinstance;

// perform all game console specific initialization
Game_Init();

// enter main event loop
while(1)
	{
	if (PeekMessage(&msg,NULL,0,0,PM_REMOVE))
		{ 
		// test if this is a quit
        if (msg.message == WM_QUIT)
           break;
	
		// translate any accelerator keys
		TranslateMessage(&msg);

		// send the message to the window proc
		DispatchMessage(&msg);
		} // end if
    
    // main game processing goes here
    Game_Main();

	} // end while

// shutdown game and release all resources
Game_Shutdown();

// return to Windows like this
return(msg.wParam);

} // end WinMain

// WINX GAME PROGRAMMING CONSOLE FUNCTIONS ////////////////
void ClearScreen(void)
{
 	for (int i=0; i<BACKGROUND_WIDTH; i++)  
		for (int j=0; j<BACKGROUND_HEIGHT; j++) map[i][j] = 0;
         
}


void GenerateBackground(int kind)
{
int i;
 	ClearScreen();
//map first level
if(kind==1)
{
//floors
	for(i=0;i<16;i++)map[i][2]=FLOOR;
    for(i=0;i<8;i++)map[i][7]=FLOOR;
    for(i=0;i<20;i++)map[i][13]=FLOOR;
    for(i=0;i<32;i++)map[i][21]=FLOOR;
	for(i=4;i<7;i++)map[17][i]=FLOOR;
	for(i=4;i<7;i++)map[18][i]=FLOOR;
	for(i=22;i<32;i++)map[i][4]=FLOOR;
	for(i=17;i<32;i++)map[i][7]=FLOOR;
	for(i=20;i<32;i++)map[i][17]=FLOOR;
	for(i=4;i<11;i++)map[i][17]=FLOOR;
//ladders
	for(i=2;i<7;i++)map[7][i]=LADDER;
    for(i=4;i<7;i++)map[19][i]=LADDER;
    for(i=4;i<7;i++)map[29][i]=LADDER;
    for(i=7;i<17;i++)map[23][i]=LADDER;
    for(i=17;i<21;i++)map[31][i]=LADDER;
    for(i=17;i<21;i++)map[4][i]=LADDER;
    for(i=7;i<13;i++)map[2][i]=LADDER;
    for(i=13;i<17;i++)map[9][i]=LADDER;
    for(i=13;i<17;i++)map[20][i]=LADDER;
//ropes
    for(i=8;i<18;i++)map[i][3]=ROPE;
    for(i=10;i<20;i++)map[i][16]=ROPE;
//gold
    map[4][1]=map[27][3]=map[17][12]=
	map[7][16]=map[27][16]=GOLD;

blockcount=2;//(193);
monk_x[0]=320,monk_y[0]=240;
monk_x[1]=520,monk_y[1]=320;
monk_x[2]=120,monk_y[2]=320;
}

if(kind==2)
{
//floors
    for(i=0;i<32;i++)map[i][21]=FLOOR;
	for(i=1;i<=6;i++)map[i][2]=FLOOR;
	for(i=1;i<=6;i++)map[i][6]=FLOOR;
    for(i=0;i<12;i++)map[i][13]=FLOOR;
    for(i=0;i<6;i++)map[i][14]=FLOOR;
	for(i=25;i<32;i++)map[i][12]=FLOOR;
	map[0][15]=FLOOR;
    for(i=20;i<31;i++)map[i][8]=FLOOR;
    for(i=0;i<18;i++)map[i][16]=FLOOR;
	for(i=14;i<24;i++)map[i][2]=FLOOR;
	for(i=14;i<19;i++)map[i][11]=FLOOR;
	for(i=25;i<31;i++)map[i][3]=FLOOR;
	for(i=28;i<32;i++)map[i][16]=FLOOR;
//ropes
    for(i=8;i<20;i++)map[i][7]=ROPE;
    for(i=17;i<24;i++)map[i][15]=ROPE;
//ladders
	for(i=2;i<13;i++)map[7][i]=LADDER;
    for(i=2;i<13;i++)map[0][i]=LADDER;
    for(i=16;i<21;i++)map[9][i]=LADDER;
    for(i=2;i<=15;i++)map[13][i]=LADDER;
    for(i=2;i<8;i++)map[24][i]=LADDER;
    for(i=12;i<16;i++)map[28][i]=LADDER;
    for(i=12;i<21;i++)map[24][i]=LADDER;
    for(i=2;i<4;i++)map[32][i]=LADDER;
    for(i=8;i<12;i++)map[19][i]=LADDER;
    for(i=8;i<=11;i++)map[31][i]=LADDER;
    for(i=12;i<20;i++)map[24][i]=LADDER;
	for(i=1;i<4;i++)map[31][i]=LADDER;
//gold
    map[4][1]=map[10][12]=map[1][15]=
	map[16][10]=map[21][1]=
	map[26][2]=map[31][15]=GOLD;
//solid floor
	for(i=1;i<2;i++)map[i][2]=SOLID_FLOOR;
	for(i=5;i<6;i++)map[i][2]=SOLID_FLOOR;
	map[12][13]=map[2][6]=map[5][6]=map[5][15]=map[5][13]=map[8][13]=SOLID_FLOOR;
	for(i=24;i<31;i++)map[i][8]=SOLID_FLOOR;
	for(i=14;i<18;i++)map[i][16]=SOLID_FLOOR;

player_x=284;player_y=380;
numgold=7;
blockcount=2;//(193);
monk_x[0]=60,monk_y[0]=100;
monk_x[1]=420,monk_y[1]=140;
monk_x[2]=100,monk_y[2]=220;
}

if(kind==3)
{
//floors
	for(i=0;i<=5;i++)map[i][4]=FLOOR;
	for(i=11;i<=22;i++)map[i][3]=FLOOR;
	for(i=6;i<=23;i++)map[i][6]=FLOOR;
	for(i=0;i<=6;i++)map[i][9]=FLOOR;
	for(i=11;i<=21;i++)map[i][10]=FLOOR;
	for(i=15;i<=24;i++)map[i][13]=FLOOR;
	for(i=15;i<=24;i++)map[i][14]=FLOOR;
	for(i=15;i<=24;i++)map[i][15]=FLOOR;
	for(i=0;i<=15;i++)map[i][16]=FLOOR;
	for(i=0;i<=15;i++)map[i][17]=FLOOR;
	for(i=0;i<=15;i++)map[i][18]=FLOOR;
	for(i=24;i<=31;i++)map[i][16]=FLOOR;
	for(i=24;i<=31;i++)map[i][17]=FLOOR;
	for(i=24;i<=31;i++)map[i][18]=FLOOR;
	for(i=0;i<=31;i++)map[i][21]=FLOOR;
	for(i=18;i<=21;i++)map[i][18]=FLOOR;
	for(i=18;i<=21;i++)map[i][19]=FLOOR;
	for(i=18;i<=21;i++)map[i][20]=FLOOR;
	for(i=30;i<=31;i++)map[i][11]=FLOOR;
//ropes
    for(i=0;i<=11;i++)map[i][1]=ROPE;
    for(i=6;i<=9;i++)map[i][12]=ROPE;
    for(i=24;i<=25;i++)map[i][8]=ROPE;
    for(i=26;i<=27;i++)map[i][9]=ROPE;
    for(i=28;i<=29;i++)map[i][10]=ROPE;
//ladders
    for(i=2;i<=3;i++)map[0][i]=LADDER;
    for(i=4;i<=8;i++)map[6][i]=LADDER;
    for(i=3;i<=5;i++)map[23][i]=LADDER;
    for(i=6;i<=9;i++)map[14][i]=LADDER;
    for(i=6;i<=9;i++)map[21][i]=LADDER;
    for(i=9;i<=15;i++)map[5][i]=LADDER;
    for(i=10;i<=12;i++)map[10][i]=LADDER;
    for(i=13;i<=15;i++)map[14][i]=LADDER;
    for(i=10;i<=12;i++)map[18][i]=LADDER;
    for(i=18;i<=20;i++)map[17][i]=LADDER;
    for(i=18;i<=20;i++)map[22][i]=LADDER;
    for(i=13;i<=15;i++)map[25][i]=LADDER;
	for(i=16;i<=20;i++)map[29][i]=LADDER;
	for(i=16;i<=20;i++)map[4][i]=LADDER;



//gold
    map[3][3]=map[3][8]=map[31][10]=
	map[16][2]=map[17][5]=
	map[20][17]=map[26][20]=GOLD;
//solid floor
	for(i=24;i<=31;i++)map[i][4]=SOLID_FLOOR;

player_x=284;player_y=380;
numgold=7;
blockcount=2;//(193);
monk_x[0]=60,monk_y[0]=100;
monk_x[1]=420,monk_y[1]=140;
monk_x[2]=100,monk_y[2]=220;
}

if(kind==4)
{
//floors
	for(i=6;i<=10;i++)map[i][10]=FLOOR;
	for(i=14;i<=18;i++)map[i][4]=FLOOR;
	map[14][3]=map[18][3]=FLOOR;
	for(i=21;i<=27;i++)map[i][10]=FLOOR;

	for(i=1;i<=7;i++)map[i][15]=FLOOR;
	for(i=14;i<=18;i++)map[i][15]=FLOOR;
	for(i=23;i<=31;i++)map[i][15]=FLOOR;
	for(i=0;i<=31;i++)map[i][21]=FLOOR;
//ropes
    for(i=0;i<=13;i++)map[i][1]=ROPE;
//ladders
    for(i=1;i<=20;i++)map[0][i]=LADDER;
    for(i=15;i<=20;i++)map[8][i]=LADDER;
    for(i=15;i<=20;i++)map[23][i]=LADDER;

    for(i=6;i<=9;i++)map[4][i]=LADDER;
    for(i=6;i<=9;i++)map[12][i]=LADDER;
    for(i=3;i<=8;i++)map[8][i]=LADDER;
	map[5][10]=map[11][10]=LADDER;
    map[4][6]=LADDER;
	map[6][11]=map[7][11]=
	map[8][11]=map[9][11]=map[7][5]=map[9][5]=LADDER;
	map[10][11]=map[5][6]=map[11][6]=LADDER;
	 map[6][8]=map[7][8]=map[9][8]=map[10][8]=LADDER;

    for(i=11;i<=14;i++)map[12][i]=LADDER;
    for(i=11;i<=14;i++)map[20][i]=LADDER;
    for(i=8;i<=13;i++)map[16][i]=LADDER;
	map[15][10]=map[17][10]=LADDER;
	map[13][11]=map[19][11]=LADDER;
	map[13][15]=map[19][15]=LADDER;
	map[14][16]=map[15][16]=
	map[16][16]=map[17][16]=map[18][16]=
	map[12][13]=map[14][13]=LADDER;
	map[14][13]=map[15][13]=map[17][13]=
	map[18][13]=LADDER;

    for(i=6;i<=9;i++)map[20][i]=LADDER;
    for(i=6;i<=9;i++)map[28][i]=LADDER;
    for(i=3;i<=8;i++)map[24][i]=LADDER;
	map[21][10]=map[27][10]=LADDER;
    map[27][6]=map[21][6]=map[22][8]=map[23][8]=map[25][8]=
	map[26][8]=LADDER;
	map[22][11]=map[23][11]=
	map[24][11]=map[25][11]=map[26][11]=
	map[23][5]=map[25][5]=LADDER;

//gold
    map[17][20]=map[17][14]=map[27][14]=
	map[6][14]=map[28][5]=
	map[4][5]=map[12][5]=map[7][9]=map[16][3]=
	map[20][5]=map[25][9]=GOLD;

player_x=284;player_y=340;
numgold=11;
blockcount=2;//(193);
monk_x[0]=180,monk_y[0]=160;
monk_x[1]=280,monk_y[1]=260;
monk_x[2]=360,monk_y[2]=160;
}

if(kind==5)
{
//floors
	for(i=0;i<=3;i++)map[i][2]=FLOOR;
	for(i=2;i<=4;i++)map[i][3]=FLOOR;
	for(i=3;i<=5;i++)map[i][4]=FLOOR;
	for(i=3;i<=6;i++)map[i][5]=FLOOR;
	for(i=0;i<=7;i++)map[i][6]=FLOOR;
	for(i=6;i<=8;i++)map[i][7]=FLOOR;
	for(i=7;i<=9;i++)map[i][8]=FLOOR;
	
	for(i=9;i<=13;i++)map[i][9]=FLOOR;
	
	for(i=19;i<=31;i++)map[i][2]=FLOOR;
	for(i=18;i<=20;i++)map[i][3]=FLOOR;
	for(i=17;i<=19;i++)map[i][4]=FLOOR;
	for(i=16;i<=18;i++)map[i][5]=FLOOR;
	for(i=15;i<=31;i++)map[i][6]=FLOOR;
	for(i=14;i<=16;i++)map[i][7]=FLOOR;
	for(i=13;i<=16;i++)map[i][8]=FLOOR;

	for(i=0;i<=31;i++)map[i][21]=FLOOR;
	for(i=0;i<=5;i++)map[i][12]=FLOOR;
	for(i=6;i<=31;i++)map[i][16]=FLOOR;
	for(i=17;i<=25;i++)map[i][12]=FLOOR;
//ladders
    for(i=6;i<=11;i++)map[2][i]=LADDER;
    for(i=9;i<=11;i++)map[11][i]=LADDER;
    for(i=2;i<=6;i++)map[23][i]=LADDER;

    for(i=6;i<=12;i++)map[19][i]=LADDER;
    for(i=12;i<=16;i++)map[23][i]=LADDER;
    for(i=16;i<=20;i++)map[28][i]=LADDER;
    for(i=16;i<=20;i++)map[14][i]=LADDER;
    for(i=12;i<=16;i++)map[6][i]=LADDER;
    for(i=12;i<=20;i++)map[0][i]=LADDER;
//gold
    map[5][11]=map[9][15]=map[13][7]=
	map[19][1]=map[27][5]=
	map[25][11]=GOLD;

player_x=254;player_y=380;
numgold=6;
num_monks=4;
blockcount=2;//(193);
monk_x[0]=60,monk_y[0]=140;
monk_x[1]=100,monk_y[1]=220;
monk_x[2]=320,monk_y[2]=300;
monk_x[3]=320,monk_y[2]=20;
}

}

///////////////////////////////////////////////////////////

int Collision_Test(int x1, int y1, int w1, int h1, 
                   int x2, int y2, int w2, int h2) 
{
// this function tests if the two rects overlap

// get the radi of each rect
int width1  = (w1>>1) - (w1>>3);
int height1 = (h1>>1) - (h1>>3);

int width2  = (w2>>1) - (w2>>3);
int height2 = (h2>>1) - (h2>>3);

// compute center of each rect
int cx1 = x1 + width1;
int cy1 = y1 + height1;

int cx2 = x2 + width2;
int cy2 = y2 + height2;

// compute deltas
int dx = abs(cx2 - cx1);
int dy = abs(cy2 - cy1);

// test if rects overlap
if (dx < (width1+width2) && dy < (height1+height2))
   return(1);
else
// else no collision
return(0);

} // end Collision_Test


void DrawMap(void)
{
//DRAW BACKGROUND
   for (int i=0; i<BACKGROUND_WIDTH; i++) {
 		for (int j=0; j<BACKGROUND_HEIGHT; j++) {
         if (map[i][j])
         for(index=0;index<blockcount;index++)
		 {
			background[index].curr_frame=map[i][j]-1;
			background[index].x=i*20,background[index].y=j*20;
			Draw_BOB(&background[index],lpddsback);

   }}}

}
   UCHAR Get_Pixel(int x, int y,UCHAR *video_buffer, int lpitch)
{
// this function gets the pixel value at x,y

return(video_buffer[x + y*lpitch]);

} // end Get_Pixel


 /*  void Draw_Circle(int radius)
{
float x=0,y=0;
int angle;
DD_Lock_Back_Surface();
for(angle=0;angle<360;angle++)
{
x=radius*cos((float)angle*PI/180);
y=radius*sin((float)angle*PI/180);
Draw_Pixel(320+x,240+y,0, back_buffer, back_lpitch);
}
DD_Unlock_Back_Surface();
}
*/
void NewGame(void)
{
player_x=254;player_y=380;
player_x_block=16;player_y_block=20;
level=START_LEVEL;
}

void StartLevelOver(int kind)
{
int index;
player_moving=STILL;
GenerateBackground(kind);
for(index=0;index<num_monks;index++)
monk[index].state=ON,monk_moving[index]=STILL;
}

void leveldone(int kind)
{
int i;
if (kind==1)for (i=0;i<7;i++)map[19][i]=LADDER;
if (kind==2)for (i=0;i<11;i++)map[31][i]=LADDER;
if (kind==3)for (i=0;i<11;i++)map[31][i]=LADDER;
if (kind==4)for (i=0;i<2;i++)map[0][i]=LADDER;
if (kind==5)for (i=0;i<9;i++)map[11][i]=LADDER;

}

int Game_Intro(void)
{

while (!intro_state)
{

if(KEY_DOWN(VK_SPACE))intro_state=1;
// lock back buffer
DD_Lock_Back_Surface(),

// draw background
Draw_Bitmap(&title,back_buffer,back_lpitch,0),

// unlock back buffer
DD_Unlock_Back_Surface();
DD_Flip();
}
return(1);
}

int Game_Init(void *parms)
{
// this function is where you do all the initialization 
// for your game

// start up DirectDraw (replace the parms as you desire)
DD_Init(SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_BPP);



Load_Bitmap_File(&bitmap8bit, "TITLE.BMP");
Set_Palette(bitmap8bit.palette);
Create_Bitmap(&title, 0,0, 640, 480);
Load_Image_Bitmap(&title,&bitmap8bit,0,0,BITMAP_EXTRACT_MODE_ABS);
Unload_Bitmap_File(&bitmap8bit);
Unload_Bitmap_File(&bitmap8bit);

// load the player ship
Load_Bitmap_File(&bitmap8bit, "LODERUNNER.BMP");

// set the palette to background image palette
Set_Palette(bitmap8bit.palette);

  // now create the player
Create_BOB(&background[0],0,0,21,21,5,
           BOB_ATTR_VISIBLE | BOB_ATTR_MULTI_FRAME,
           DDSCAPS_SYSTEMMEMORY);

// load block frames
for (int index=0; index<5; index++)
Load_Frame_BOB(&background[0],&bitmap8bit,index,index,0,BITMAP_EXTRACT_MODE_CELL);  

// set position
Set_Pos_BOB(&background[0],277,74);

for (index=1; index<MAX_BACKGROUND; index++)
    memcpy(&background[index], &background[0], sizeof(BOB));

///////////////////////////////////////////////////////////////
  // now create the player
player_x=284,player_y=260;

Create_BOB(&player,0,0,19,25,52,
           BOB_ATTR_VISIBLE | BOB_ATTR_MULTI_FRAME,
           DDSCAPS_SYSTEMMEMORY);

for (index=0; index<22; index++)
Load_Frame_BOB(&player,&bitmap8bit,index,index,1,BITMAP_EXTRACT_MODE_CELL);  

for (index=22; index<41; index++)
Load_Frame_BOB(&player,&bitmap8bit,index,index-22,2,BITMAP_EXTRACT_MODE_CELL);  

for (index=41; index<52; index++)
Load_Frame_BOB(&player,&bitmap8bit,index,index-41,3,BITMAP_EXTRACT_MODE_CELL);  

// set position
Set_Pos_BOB(&player,player_x,player_y);

Create_BOB(&player_blasting,0,0,50,50,16,
           BOB_ATTR_VISIBLE | BOB_ATTR_MULTI_FRAME,
           DDSCAPS_SYSTEMMEMORY);

for (index=0; index<8; index++)
Load_Frame_BOB(&player_blasting,&bitmap8bit,index,index,2,BITMAP_EXTRACT_MODE_CELL);  

for (index=9; index<16; index++)
Load_Frame_BOB(&player_blasting,&bitmap8bit,index,index-9,3,BITMAP_EXTRACT_MODE_CELL);  

// set position
Set_Pos_BOB(&player_blasting,player_x,player_y);

player_moving=STILL;

//////////////////////////////////////////////////////////////////////
  // now create the monks
Create_BOB(&monk[0],0,0,19,20,63,
           BOB_ATTR_VISIBLE | BOB_ATTR_MULTI_FRAME,
           DDSCAPS_SYSTEMMEMORY);

// load block frames
for (index=0; index<24; index++)
Load_Frame_BOB(&monk[0],&bitmap8bit,index,index,10,BITMAP_EXTRACT_MODE_CELL);  

for (index=25; index<63; index++)
Load_Frame_BOB(&monk[0],&bitmap8bit,index,index-25,11,BITMAP_EXTRACT_MODE_CELL);  

monk[0].state=ON;

for (index=1; index<MAX_MONKS; index++)
    memcpy(&monk[index], &monk[0], sizeof(BOB));

for (index=1; index<MAX_MONKS; index++)
monk_moving[index]=RIGHT;
//////////////////////////////////////////////////////////////////////
Create_BOB(&killing,0,0,29,19,13,
           BOB_ATTR_VISIBLE | BOB_ATTR_MULTI_FRAME,
           DDSCAPS_SYSTEMMEMORY);

// load block frames
for (index=0; index<13; index++)
Load_Frame_BOB(&killing,&bitmap8bit,index,index,14,BITMAP_EXTRACT_MODE_CELL);  

Set_Pos_BOB(&killing,player_x,player_y);

//////////////////////////////////////////////////
Create_BOB(&melting_block[0],0,0,21,21,7,
           BOB_ATTR_VISIBLE | BOB_ATTR_MULTI_FRAME,
           DDSCAPS_SYSTEMMEMORY);

// load block frames
for (index=0; index<7; index++)
Load_Frame_BOB(&melting_block[0],&bitmap8bit,index,index+5,0,BITMAP_EXTRACT_MODE_CELL);  

Set_Pos_BOB(&melting_block[0],player_x,player_y);
melting_block[0].state=OFF;
for (index=1; index<MAX_MELTING_BLOCKS; index++)
    memcpy(&melting_block[index], &melting_block[0], sizeof(BOB));

////////////////////////////////////////////////////

// unload data infile
Unload_Bitmap_File(&bitmap8bit);
GenerateBackground(level);

// return success
RECT screen_rect = {0,0,screen_width,screen_height};
lpddclipper = DD_Attach_Clipper(lpddsback,1,&screen_rect);

// seed random number generate
srand(Start_Clock());

NewGame();
// hide the mouse
ShowCursor(FALSE);
return(1);

} // end Game_Init

///////////////////////////////////////////////////////////

int Game_Shutdown(void *parms)
{
// this function is where you shutdown your game and
// release all resources that you allocated

// shut everything down

Destroy_Bitmap(&title);

for (int index=0; index<MAX_BACKGROUND; index++)
	Destroy_BOB(&background[index]);


for (index=0; index<MAX_MONKS; index++)
	Destroy_BOB(&monk[index]);

for (index=0; index<5; index++)
	Destroy_BOB(&melting_block[index]);

Destroy_BOB(&player),
Destroy_BOB(&player_blasting);

Destroy_BOB(&killing);

// shutdown directdraw last
DD_Shutdown();


// return success
return(1);
} // end Game_Shutdown

///////////////////////////////////////////////////////////

int Game_Main(void *parms)
{
// this is the workhorse of your game it will be called
// continuously in real-time this is like main() in C
// all the calls for you game go here!

// check of user is trying to exit
if (KEY_DOWN(VK_ESCAPE))
    PostMessage(main_window_handle, WM_DESTROY,0,0);

// start the timing clock
Start_Clock();

// clear the drawing surface
DD_Fill_Surface(lpddsback, 0);

if (intro_state==0) Game_Intro();

// lock back buffer
DD_Lock_Back_Surface();

// unlock back buffer
DD_Unlock_Back_Surface();



DrawMap();

if (KEY_DOWN('P') && gameover)
    {
gameover=0;
NewGame();
    } // end if



if(!gameover)
{
//assign a block to player


if (player_moving!=FALLING && blast_count==0)
{
	if (KEY_DOWN(VK_RIGHT))
    {
    // move player to right
//if(player_collision)
player_moving=RIGHT,seq_right++;
if(map[player_x_block][player_y_block]==ROPE)player_moving=ROPE_RIGHT,seq_rope_right++;
if(player_x<625 && map[(player_x+15)/20][player_y_block]!=FLOOR
   &&map[(player_x+15)/20][player_y_block]!=SOLID_FLOOR)player_x+=2; 
} // end if
if (KEY_DOWN(VK_LEFT))
    {
player_moving=LEFT,seq_left++;
if(map[player_x_block][player_y_block]==ROPE)player_moving=ROPE_LEFT,seq_rope_left++;

    // move player to left
if(player_x>0&&map[(player_x-1)/20][player_y_block]!=FLOOR
   &&map[(player_x-1)/20][player_y_block]!=SOLID_FLOOR)player_x-=2; 
	} // end if
if (KEY_DOWN('Z'))
    {
if(player_x<(player_x_block*20)+15 && player_x>(player_x_block*20) &&
map[player_x_block-1][player_y_block+1]==FLOOR)player_moving=BLAST_LEFT;
    } // end if

if (KEY_DOWN('X'))
    {
if(player_x<(player_x_block*20)+18 && player_x>(player_x_block*20) &&
map[player_x_block+1][player_y_block+1]==FLOOR)player_moving=BLAST_RIGHT;
    } // end if

if (KEY_DOWN(VK_UP))
    {
if(map[player_x_block][player_y_block]==LADDER ||
   map[player_x_block][player_y_block+1]==LADDER)player_y-=2,
player_moving=UP,seq_climb++;
    } // end if
if (KEY_DOWN(VK_DOWN))
    {
    // move player down
if(map[player_x_block][player_y_block+1]==LADDER ||
(map[player_x_block][player_y_block]==LADDER &&
 map[player_x_block][player_y_block+1]==EMPTY))player_y+=2,
player_moving=DOWN,seq_climb++;
if(map[player_x_block][player_y_block]==ROPE)player_moving=FALLING,forcefall=1;

}}}


if(!beingkilled)
{
//player moves

player_x_block=(player_x+10)/20;

player_y_block=player_y/20;
if(map[player_x_block][player_y_block+1]==LADDER)player_y_block=(player_y+19)/20;

if(player_moving==DOWN&&(map[player_x_block][player_y_block+1]==FLOOR
   ||map[player_x_block][player_y_block+1]==SOLID_FLOOR))player_y_block=(player_y)/20;

//if(blast_count==0 )player_moving=STILL;
player.x=player_x;
player.y=player_y;

player_blasting.y=player_y;
melting_block[melt_block_used].y=player.y+20;

if (player_moving != FALLING)
{
if (player_moving==STILL&&map[player_x_block][player_y_block]!=LADDER)player.curr_frame=49;   

if (player_moving==LEFT)player.curr_frame=seq_left;
if (player_moving==RIGHT)player.curr_frame=seq_right;   
//player climbing
if (player_moving==UP || player_moving==DOWN)player.curr_frame=seq_climb;   

//////////////////////////////////////////////////////////////


//player blasting
if (player_moving==BLAST_LEFT || player_moving==BLAST_RIGHT)
{
if (player_moving==BLAST_LEFT)blast=LEFT;
if (player_moving==BLAST_RIGHT)blast=RIGHT;

if (blast==LEFT)
{
player_blasting.x=player_x-26;
if (melting_block[melt_block_used].state==OFF)
{
	melting_block[melt_block_used].state=ON;
	melting_block[melt_block_used].x=player.x-20;
}
melting_block[melt_block_used].curr_frame=seq_melt_block1;
melt_block_x_block[melt_block_used]=player_x_block-1,
melt_block_y_block[melt_block_used]=player_y_block+1,
map[melt_block_x_block[melt_block_used]][melt_block_y_block[melt_block_used]]=MELT_BLOCK,
player_blasting.curr_frame=seq_left_blast,blast_count++;   
seq_left_blast++;
seq_melt_block1=seq_left_blast;
if (seq_left_blast>7)seq_left_blast=0;
}

if (blast==RIGHT)
{
player_blasting.x=player_x-13;
	if (melting_block[melt_block_used].state==OFF)
{
	melting_block[melt_block_used].state=ON;
	melting_block[melt_block_used].x=player.x+20;
}
melting_block[melt_block_used].curr_frame=seq_melt_block1;


melt_block_x_block[melt_block_used]=player_x_block+1,
melt_block_y_block[melt_block_used]=player_y_block+1,
map[melt_block_x_block[melt_block_used]][melt_block_y_block[melt_block_used]]=MELT_BLOCK,
blast_count++;   
player_blasting.curr_frame=seq_right_blast,blast_count++;   
seq_right_blast++;
seq_melt_block1=seq_right_blast-7;
if (seq_right_blast>14)seq_right_blast=7;
}

if (blast_count>7)blast=STILL,player_moving=STILL,blast_count=0,melt_block_used++;

}

///////////////////////////////////////////////////

for(index=0;index<MAX_MELTING_BLOCKS;index++)
{

if (melting_block[index].counter_1>100)
{
	melting_block[index].curr_frame=seq_melt_block2;
	seq_melt_block2--;
if (!seq_melt_block2)
{
	map[melt_block_x_block[index]][melt_block_y_block[index]]=FLOOR,
    melting_block[index].counter_1=0,melting_block[index].state=OFF;
}
}

if(melting_block[index].state==ON)
	{
		melting_block[index].counter_1++;
		Draw_BOB(&melting_block[index],lpddsback);
	}

}
if (melt_block_used>MAX_MELTING_BLOCKS-1)melt_block_used=0;

//player using ropes?
if (player_moving==ROPE_RIGHT)player.curr_frame=seq_rope_right;
if (player_moving==ROPE_LEFT)player.curr_frame=seq_rope_left;

}

if (player_moving==FALLING && (map[player_x_block][player_y_block+1]==FLOOR||
map[player_x_block][player_y_block+1]==LADDER||
map[player_x_block][player_y_block+1]==SOLID_FLOOR))player_moving=STILL;

//player falling?
if (map[player_x_block][player_y_block]!=LADDER && (map[player_x_block][player_y_block+1]==EMPTY|| 
	map[player_x_block][player_y_block+1]==ROPE)&&
	player_moving!=ROPE_RIGHT && player_moving!=ROPE_LEFT)
	player_moving=FALLING, 
	player.curr_frame=seq_falling,player_y+=2;   

//if (player_moving==DOWN &&
//	map[player_x_block][player_y_block]==LADDER && 
//	map[player_x_block][player_y_block+1]==EMPTY) 
//	player_moving=FALLING, 
//	player.curr_frame=seq_falling,player_y+=2;   

if (map[player_x_block][player_y_block+1]==MELT_BLOCK)
player_moving=FALLING, player.curr_frame=seq_falling,player_y+=2;   
//if(map[player_x_block][player_y_block+1]==ROPE&&(player_moving==ROPE_RIGHT || player_moving==ROPE_LEFT))
if (map[player_x_block][player_y_block+1]==GOLD)
player_moving=FALLING, player.curr_frame=seq_falling,player_y+=2;   


if (player_moving==FALLING && map[player_x_block][player_y_block]==ROPE && forcefall)player_moving=FALLING,player.curr_frame=seq_falling,player_y+=2;
if (player_moving==FALLING && map[player_x_block][player_y_block]==ROPE && !forcefall)player_moving=ROPE_RIGHT;
if (player_moving==FALLING && map[player_x_block][player_y_block-1]==ROPE && forcefall)forcefall=0;
//player gets gold
if(map[player_x_block][player_y_block]==GOLD)map[player_x_block][player_y_block]=EMPTY,
score+=100,numgold--;



//next level?
if (!numgold)leveldone(level);

if(player_y<-20)level++, GenerateBackground(level),score+500;


//player animation sequences
seq_falling++;
//seq_melt_block1++,seq_melt_block2--;

if (seq_left>9)seq_left=0;
if (seq_right>20)seq_right=11;
if (seq_climb>28)seq_climb=22;
if (seq_falling>48)seq_falling=41;
if (seq_rope_right>35)seq_rope_right=30;
if (seq_rope_left>40)seq_rope_left=36;
if (seq_melt_block1>6)seq_melt_block1=0;
if(!seq_melt_block2)seq_melt_block2=7;
if (!blast)Draw_BOB(&player,lpddsback);   
if (blast)Draw_BOB(&player_blasting,lpddsback);   


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////


//move & draw monks
for(index=0;index<num_monks;index++)
{

monk_x_block[index]=monk_x[index]/20;
//monk_y_block[index]=ceil(monk_y[index]/20);
monk_y_block[index]=monk_y[index]/20;

monk[index].x=monk_x[index],monk[index].y=monk_y[index];

if (monk_moving[index]==TRAPPED)
{
monk[index].curr_frame=51;
if(map[monk_x_block[index]][monk_y_block[index]]==FLOOR)
	score+=500,monk_x[index]=rand()%640,monk_y[index]=0,monk_moving[index]=FALLING;
}

if (monk_moving[index]!=TRAPPED)
{
//monk standing still
if (monk_x[index]==player_x)monk_moving[index]=STILL,monk[index].curr_frame=51;

if(monk_moving[index]!=FALLING && monk_moving[index]!=UP
   && monk_moving[index]!=DOWN)
{
    if(player_x<monk_x[index] && (map[monk_x_block[index]-1][monk_y_block[index]]!=FLOOR
    &&map[monk_x_block[index]-1][monk_y_block[index]]!=SOLID_FLOOR))
	monk_moving[index]=LEFT,monk[index].curr_frame=seq_monk_left,monk_x[index]--;

    if(player_x>monk_x[index] && (map[monk_x_block[index]+1][monk_y_block[index]]!=FLOOR
    &&map[monk_x_block[index]+1][monk_y_block[index]]!=SOLID_FLOOR))
	monk_moving[index]=RIGHT,monk[index].curr_frame=seq_monk_right,monk_x[index]++;

    if(map[monk_x_block[index]][monk_y_block[index]+1]==ROPE)
	monk_moving[index]=FALLING;
}

//monk falling
if(monk_moving[index]==FALLING && map[monk_x_block[index]][(monk_y[index]-5)/20]==ROPE
   && player_y<monk_y[index])   monk_moving[index]=ROPE_RIGHT;

if(monk_moving[index]==FALLING)monk[index].curr_frame=seq_monk_fall,monk_y[index]++;
if(monk_moving[index]==FALLING && (map[monk_x_block[index]][monk_y_block[index]+1]==FLOOR
   ||map[monk_x_block[index]][monk_y_block[index]+1]==SOLID_FLOOR
   ||map[monk_x_block[index]][monk_y_block[index]+1]==LADDER))
   monk_moving[index]=STILL;

//monk has fallen off screen
if(monk_y[index]>480) monk_x[index]=rand()%640,monk_y[index]=0;


if(monk_moving[index]!=FALLING)
{
if(monk_moving[index]==LEFT && map[(monk_x[index]+15)/20][monk_y_block[index]] != ROPE 
   && map[(monk_x[index]+15)/20][monk_y_block[index]+1]==EMPTY)monk_moving[index]=FALLING;
if(monk_moving[index]==RIGHT && map[(monk_x[index])/20][monk_y_block[index]] != ROPE 
   && map[monk_x_block[index]][monk_y_block[index]+1]==EMPTY)monk_moving[index]=FALLING;

if(monk_moving[index]==LEFT && map[(monk_x[index]+15)/20][monk_y_block[index]+1]==MELT_BLOCK)monk_moving[index]=FALLING;
if(monk_moving[index]==RIGHT && map[(monk_x[index])/20][monk_y_block[index]+1]==MELT_BLOCK)monk_moving[index]=FALLING;


//monk on ladder
if(monk_moving[index]==LEFT &&(map[(monk_x[index]+15)/20][monk_y_block[index]+1]==LADDER ||
   map[monk_x_block[index]][monk_y_block[index]]==LADDER) &&
   player_y>monk_y[index]&&map[monk_x_block[index]][monk_y_block[index]+1]!=FLOOR)
   monk_moving[index]=DOWN;

if(monk_moving[index]==RIGHT &&(map[(monk_x[index])/20][monk_y_block[index]+1]==LADDER ||
   map[monk_x_block[index]][monk_y_block[index]]==LADDER) &&
   player_y>monk_y[index]&&map[monk_x_block[index]][monk_y_block[index]+1]!=FLOOR)
   monk_moving[index]=DOWN;

if(monk_moving[index]==LEFT && (map[(monk_x[index]+15)/20][monk_y_block[index]-1]==LADDER ||
   map[(monk_x[index]+15)/20][monk_y_block[index]]==LADDER)
   &&player_y<monk_y[index] ) monk_moving[index]=UP;

if(monk_moving[index]==RIGHT && (map[monk_x_block[index]][monk_y_block[index]-1]==LADDER ||
   map[monk_x_block[index]][monk_y_block[index]]==LADDER)
   &&player_y<monk_y[index] ) monk_moving[index]=UP;

if(monk_moving[index]==DOWN && map[monk_x_block[index]][monk_y_block[index]+1]==FLOOR)monk_moving[index]=STILL;
monk_y_block[index]=monk_y[index]/20;

if(monk_moving[index]==DOWN && player_y_block<monk_y_block[index])monk_moving[index]=UP;
if(monk_moving[index]==UP && player_y_block>monk_y_block[index])monk_moving[index]=DOWN;

if(monk_moving[index]==DOWN && map[monk_x_block[index]][monk_y_block[index]+1]==EMPTY
   &&map[monk_x_block[index]][monk_y_block[index]]==EMPTY)monk_moving[index]=FALLING;

if(monk_moving[index]==DOWN && map[monk_x_block[index]+1][monk_y_block[index]+1]==FLOOR
   &&player_x>monk_x[index] && player_y_block<=monk_y_block[index])monk_moving[index]=RIGHT;

if(monk_moving[index]==DOWN)monk[index].curr_frame=seq_monk_climb,monk_y[index]++;
if(monk_moving[index]==UP)monk[index].curr_frame=seq_monk_climb,monk_y[index]--;
if(monk_moving[index]==UP && map[monk_x_block[index]][(monk_y[index]+19)/20]==EMPTY)
monk_moving[index]=STILL;
if((monk_moving[index]==UP || monk_moving[index]==DOWN)
   &&map[monk_x_block[index]+1][monk_y_block[index]]==ROPE
   &&player_x>monk_x[index])monk_moving[index]=ROPE_RIGHT;

if((monk_moving[index]==UP || monk_moving[index]==DOWN)
   &&map[monk_x_block[index]-1][monk_y_block[index]]==ROPE
   &&player_x<monk_x[index])monk_moving[index]=ROPE_LEFT;

//monk on rope
if(map[monk_x_block[index]][monk_y_block[index]]==ROPE &&
   player_x<monk_x[index])monk_moving[index]=ROPE_LEFT,monk[index].curr_frame=seq_monk_rope_left;

if(map[monk_x_block[index]][monk_y_block[index]]==ROPE &&
   player_x>monk_x[index])monk_moving[index]=ROPE_RIGHT,monk[index].curr_frame=seq_monk_rope_right;

if(player_y_block>monk_y_block[index] && monk_moving[index]==ROPE_RIGHT && map[(monk_x[index]-15)/20][monk_y_block[index]+1]==EMPTY)
   monk_moving[index]=FALLING;

//sprintf(buffer,"%d",monk_moving[index]);
//Draw_Text_GDI(buffer, 30*index,120,RGB(0,255,0),lpddsback);

if(player_y_block>monk_y_block[index]&& monk_moving[index]==ROPE_LEFT && map[(monk_x[index]+15)/20][monk_y_block[index]+1]==EMPTY)
   monk_moving[index]=FALLING;

}}
//check to see if monk has caught player
if(monk_x_block[index]==player_x_block &&
monk_y_block[index]==player_y_block)killing.x=player.x, killing.y=player.y+2,beingkilled=1,round=0,monk[index].state=OFF;

if(map[monk_x_block[index]][monk_y_block[index]]==MELT_BLOCK)monk_moving[index]=TRAPPED;

//draw monk
Draw_BOB(&monk[index],lpddsback);   
}
//monk animation sequences
seq_monk_climb++,seq_monk_left++,seq_monk_right++,seq_monk_fall++,
seq_monk_rope_right++,seq_monk_rope_left++;
if (seq_monk_left>19)seq_monk_left=10;
if (seq_monk_right>9)seq_monk_right=0;
if (seq_monk_climb>31)seq_monk_climb=24;
if (seq_monk_fall>23)seq_monk_fall=20;
if (seq_monk_rope_left>41)seq_monk_rope_left=32;
if (seq_monk_rope_right>51)seq_monk_rope_right=42;

}

if (beingkilled) 
{
Draw_BOB(&killing,lpddsback);

for(index=0;index<num_monks;index++)
if(monk[index].state==ON)Draw_BOB(&monk[index],lpddsback);

if (++round>1)seq_killing1++,seq_killing2++, round=0;
if(seq_killing1<5)killing.curr_frame=seq_killing1;
else killing.curr_frame=seq_killing2;
if(seq_killing2>12)seq_killing2=5;
if (++round2>157)round2=0,beingkilled=0,men_left--,seq_killing1=0,StartLevelOver(level);

}
if(player_y>480) men_left--,StartLevelOver(level);
                                 
Draw_Text_GDI("MAX'S LODE RUNNER!",0,440,RGB(255,255,45),lpddsback);
sprintf(buffer,"%d",score);
Draw_Text_GDI(buffer, 425,440,RGB(0,255,0),lpddsback);
Draw_Text_GDI("Score = ",375,440,RGB(255,255,45),lpddsback);
sprintf(buffer,"%d",men_left);//block_y);
Draw_Text_GDI(buffer, 575,440,RGB(0,255,0),lpddsback);
Draw_Text_GDI("Men Left = ",505,440,RGB(255,255,45),lpddsback);
sprintf(buffer,"%d",level);//block_y);
Draw_Text_GDI(buffer, 275,440,RGB(0,255,0),lpddsback);
Draw_Text_GDI("Level = ",225,440,RGB(255,255,45),lpddsback);


   if (!men_left) 
   {
   Draw_Text_GDI("G A M E    O V E R",
                 320-6*strlen("G A M E    O V E R")/2,
                 200,RGB(255,0,0),lpddsback);
   Draw_Text_GDI("Press Escape To Exit",
                 320-6*strlen("Press Escape To Exit")/2,
                 240,RGB(255,0,0),lpddsback);
   Draw_Text_GDI("or 'P' to Play Again",
                 320-6*strlen("or 'P' to Play Again")/2,
                 260,RGB(255,0,0),lpddsback);

if (score>high_score)high_score=score;
gameover=1;
   }

// flip the surfaces
DD_Flip();

// sync to 30ish fps
Wait_Clock(30);

// return success
return(1);

} // end Game_Main

//////////////////////////////////////////////////////////
/*Draw_Text_GDI("moving=",300,200,RGB(255,255,45),lpddsback);
sprintf(buffer,"%d",player_moving);
Draw_Text_GDI(buffer, 360,200,RGB(0,255,0),lpddsback);

Draw_Text_GDI("x=",300,220,RGB(255,255,45),lpddsback);
sprintf(buffer,"%d",player_x);
Draw_Text_GDI(buffer, 320,220,RGB(0,255,0),lpddsback);
sprintf(buffer,"%d",player_x_block);
Draw_Text_GDI(buffer, 320,240,RGB(0,255,0),lpddsback);

Draw_Text_GDI("y=",400,220,RGB(255,255,45),lpddsback);
sprintf(buffer,"%d",player_y);
Draw_Text_GDI(buffer, 420,220,RGB(0,255,0),lpddsback);
sprintf(buffer,"%d",player_y_block);
Draw_Text_GDI(buffer, 420,240,RGB(0,255,0),lpddsback);
/*
for(index=0;index<640;index+=20)
{
sprintf(buffer,"%d",index/20);
Draw_Text_GDI(buffer, index,425,RGB(0,255,0),lpddsback);
sprintf(buffer,"%d",index/20);
Draw_Text_GDI(buffer, 5,index,RGB(0,255,0),lpddsback);
sprintf(buffer,"%d",index);
Draw_Text_GDI(buffer, 25,index,RGB(0,255,0),lpddsback);
}

VLine(player_y_block*20,(player_y_block*20)+20,player_x_block*20,255,back_buffer,back_lpitch);
VLine(player_y_block*20,(player_y_block*20)+20,(player_x_block*20)+20,255,back_buffer,back_lpitch);

for(index=0;index<640;index+=20)
VLine(0,(screen_height-1),index,255,back_buffer,back_lpitch);

for(index=0;index<480;index+=20)
HLine(0,(screen_width-1),index,255,back_buffer,back_lpitch);
Draw_Pixel(player_x,player_y,250, back_buffer, back_lpitch);
//	sprintf(buffer,"%d",monk_moving[index]);
//Draw_Text_GDI(buffer, 100+(30* index),120,RGB(0,255,0),lpddsback);
//sprintf(buffer,"%d",(monk_y[index]+21)/20);
//Draw_Text_GDI(buffer, 100+(30* index),100,RGB(0,255,0),lpddsback);

for(index=0;index<num_monks;index++)
{
VLine(monk_y_block[index]*20,(monk_y_block[index]*20)+20,(monk_x_block[index]*20),255,back_buffer,back_lpitch);
VLine(monk_y_block[index]*20,(monk_y_block[index]*20)+20,(monk_x_block[index]*20)+20,255,back_buffer,back_lpitch);
}
//sprintf(buffer,"%d",map[player_x_block][player_y_block-1]);
//Draw_Text_GDI(buffer, 355,250,RGB(0,255,0),lpddsback);

//sprintf(buffer,"%d",player_x);
//Draw_Text_GDI(buffer, 375,220,RGB(0,255,0),lpddsback);
*/