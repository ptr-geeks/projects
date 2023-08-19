using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class Sell : MonoBehaviour
{

    [SerializeField] Animator sellAnim;
    public bool canSell = false;
    [SerializeField] Farm script;
    [SerializeField] Interact sellScript;
    [SerializeField] TMP_Text alertText;
    public int wheatAmount = 0;
    [SerializeField] bool canBuy = false;
    [SerializeField] Animator buyAnim;

    // Start is called before the first frame update
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {
        if (canBuy == true)
        {
            if (script.hoe == false && sellScript.coinCount >= 5)
            {
                if (Input.GetKeyDown(KeyCode.B))
                {
                    script.hoe = true;
                    sellScript.coinCount -= 5;
                    buyAnim.SetBool("canBuy", false);
                }
                buyAnim.SetBool("canBuy", true);
            }
            if (script.hoe == false && Input.GetKeyDown(KeyCode.B) && sellScript.coinCount < 5)
            {
                alertText.text = "You do not have enough coins to purchase a hoe";
            }
        }
        

        if (canSell == true)
        {
            if (Input.GetKeyDown(KeyCode.E) && script.wheat > 0)
            {
                script.wheat *= 2;
                sellScript.coinCount += script.wheat;
                script.wheat = 0;
                wheatAmount = 0;
            }
            else if (Input.GetKeyDown(KeyCode.E) && script.wheat <= 0)
            {
                alertText.text = "You do not have enough wheat";
            }
        }
    }
    void OnTriggerEnter2D()
    {
        canSell = true;
        canBuy = true;
        sellAnim.SetBool("canSell", true);
    }
    void OnTriggerExit2D()
    {
        canSell = false;
        canBuy = false;
        sellAnim.SetBool("canSell", false);
        buyAnim.SetBool("canBuy", false);
    }

}
