def caesar_cipher(text,shift):
    result = ""
    alpha= "abcdefghijklmnopqrstuvwxyz"

    for char in text:
        if char in alpha:
            result += alpha[(alpha.index(char) + shift) % len(alpha)]
        else:
            result += char  
    return result

print(caesar_cipher("Welcome to Karoka", 9)) # "khoor"


def hex_to_bin(hex):
    return bin(int(hex, 16))[2:]

print(hex_to_bin("0aa39fd10e")) #101010100011100111111101000100001110

def acuteFunction(arr,target):
    ans=0
    low = 0
    high = len(arr) - 1
    mid = 0

    while low <= high:
        mid = (high + low) // 2
        ans+=arr[mid]
        if arr[mid] == target:
            break
        elif arr[mid] < arr[high]:
            high = mid - 1
        else:
            low = mid + 1

    return ans

print(acuteFunction([2,3,4,5], 2)) 