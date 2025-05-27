#include <stdio.h>

int main() {
    int n = 5;
    while (n != 1) {
        printf("%d\n", n);
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
    }
    printf("%d\n", n);
    return 0;
}
