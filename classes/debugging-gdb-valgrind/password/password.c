/**
 * A simple "password" program. The password is hardcoded for simplicity. The 
 * user can attempt at most 3 password guesses. The goal: successfully "authenticate".
 *
 * What I wanted to demonstrate in this program is the fact that certain, 
 * well-crafted password guesses can result in a successful authentication as 
 * far as the program is concerned (i.e., the "success!" message is printed). 
 *
 * The hardcoded password is currently "cs50". I found that a password guess of 
 * "abcdefghijklmn" allows me to authenticate..... What is happening?! :)
 *
 * NOTE: This has only been tested on the cs linux servers.
 *
 * - Travis Peters, CS50, April 2016
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

// global *variables*
const int MAX_NUM_GUESSES = 3;      // the max. number of password guesses allowed
const char PASSWORD[] = "cs50";     // The fixed password of length = 4 (+1 for '\0')
                                    // (NOTE: never hardcode password! :)
                                    // Try this "password": abcdefghijklmn

// function prototype *declarations*
static int check_password();

////////////////////////////////////////////////////////////////////////////////

/*
 * Main loop - ask for a guess, quit when it matches the answer or when guesses 
 * exceeds MAX_NUM_GUESSES.
 */
int main(const int argc, const char *argv[]) {
    int n_guesses = 0;   // the curr. number of guess attempts.

    // interpret arguments
    if (argc != 1) {
        // incorrect number of args
        fprintf(stderr, "usage: %s\n", argv[0]);
        exit(1);
    }

    // get password and check if user authenticated
    int result; 
    while (n_guesses < MAX_NUM_GUESSES) {
        result = check_password();
        n_guesses++;
        if (result)
            break;
        else
            printf("incorrect. try again. (attempt %d)\n", n_guesses);
    }

    // check: did we exit because we ran out of guesses?!
    if (!result && n_guesses == MAX_NUM_GUESSES) {
        printf("you've exceeded the max. number of attempts. try again later.\n");
        exit(2);
    }

    printf("success!\n");
    return 0;
}

static int check_password() {
    char guess[10];          // char. buffer for holding the password guess.
    int authenticated = 0;   // "flag" that determines if the user successfully authenticated. 

    // if fgets encounters an error, or EOF after no input, it returns NULL.
    printf("password: ");
    if (fgets(guess, 50, stdin) == NULL)
        return authenticated;

    // this should not happen, but I want to protect the subscript below
    if (strlen(guess) == 0)
        return authenticated;

    // fgets guarantees the string is null-terminated, but there may not be a
    // newline if the buffer filled before a newline was encountered.
    // if that happens, clear the stdio input until newline or EOF.
    if (guess[strlen(guess)-1] != '\n') {
        // strip characters until end of file or newline is reached
        while ( !feof(stdin) && getchar() != '\n' )
            ; // discard the rest of characters on input line
        return authenticated;
    } else {
        // get rid of \n at end of buffer.
        guess[strlen(guess)-1] = 0;
    }

    // check "guessed" password against the correct password.
    if (strcmp(PASSWORD, guess) == 0)
        authenticated = 1;

    return authenticated;
}
