using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class Interact : MonoBehaviour
{

    public Rigidbody2D rb;
    public Animator animator;
    public Animator playeranim;
    public bool canInteract;
    public bool isTouching;
    public float iTime = 0f;
    public int coinCount = 0;
    public TMP_Text text;
    public float sTime = 0f;
    public TMP_Text wTime;
   
    // Start is called before the first frame update
    void Start()
    {
        //text.text = "0";
        
    }

    // Update is called once per frame
    void Update()
    {
        text.text = "Coins " + coinCount;
        if (sTime >= 0)
        {
            wTime.text = "";
        }
        text.text = "Coins " + coinCount;
        if (isTouching == true && Input.GetKeyDown(KeyCode.E) && sTime >= 0)
        {
            canInteract = true;
            playeranim.SetBool("isRaking", true);
        }
        if(isTouching == true && Input.GetKeyDown(KeyCode.E) && sTime < 0)
        {
            wTime.text = "You can rake again in " + Mathf.Abs(sTime / 50)  + " seconds";
        }
    }

    private void OnTriggerEnter2D(Collider2D other)
    {
        animator.SetBool("Collide", true);
        isTouching = true;
        
        
    }
    private void OnTriggerExit2D(Collider2D other)
    {
        animator.SetBool("Collide", false);
        isTouching = false;
        canInteract = false;
    }
    void FixedUpdate()
    {
        sTime += 1;
        if (canInteract == true)
            iTime += 1;

        else if(canInteract == false)
            iTime = 0;

        if (iTime == 250)
        {
            iTime = 0;
            coinCount += 1;
            canInteract = false;
            playeranim.SetBool("isRaking", false);
            playeranim.SetBool("isRakingC", false);
            sTime = -60;

        }
        if (iTime == 50)
        {

            playeranim.SetBool("isRakingC", true);

        }

    }
}
    
