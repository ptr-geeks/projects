using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
public class Farm : MonoBehaviour
{
    public Animator farmAnim;
    public Animator playerAnim;
    public TMP_Text WaitText;
    public TMP_Text wheatAmount;
    public bool isFarmable = false;
    public float farmTime = 0f;
    public bool isFarming = false;
    public float waitTime = 0;
    public int wheat = 0;
    public bool hoe = false;
    [SerializeField] Animator buyAnim;


    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        wheatAmount.text = "Wheat " + wheat;
        if (isFarmable == true && Input.GetKeyDown(KeyCode.E) && waitTime >= 0)
        {
            isFarming = true;
            farmAnim.SetBool("isHarvesting", true);
            playerAnim.SetBool("isFarming", true);
        }
        if (isFarmable && Input.GetKeyDown(KeyCode.E) && waitTime < 0)
        {
            WaitText.text = "You can farm again in" + waitTime / 50 + "seconds";
        } 
        if (farmTime >= 250)
        {

        farmTime = 0;
        waitTime = -250;
        farmAnim.SetBool("isHarvested", true);
        farmAnim.SetBool("isGrown", false);
        isFarming = false;
        wheat += 1;
        playerAnim.SetBool("isFarmingC", false);
        playerAnim.SetBool("isFarming", false);
        } 
        if(farmTime >= 12)
        {
            playerAnim.SetBool("isFarmingC", true);
        }
    }
    void FixedUpdate()
    {
        if(isFarming == true)
        {
            farmTime += 1;
        }
        if(farmTime == 0)
        {
            waitTime += 1;
        }
        farmAnim.SetFloat("growTime", (waitTime));
        if(waitTime >= 0)
        {
            farmAnim.SetBool("isHarvested", false);
        }

    }

    void OnTriggerEnter2D()
    {
        if (hoe == true)
        {
            isFarmable = true;
        }
    }
    void OnTriggerExit2D()
    {
        isFarmable = false;
    }

    }
