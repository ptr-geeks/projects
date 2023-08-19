using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerMovement : MonoBehaviour
{
    public float moveSpeed = 5f;
    public bool Move = false;
    public Rigidbody2D rb;
    public Animator animator;
    Vector2 movement;
    // Update is called once per frame
    void Update()
    {
        // Input
        movement.x = Input.GetAxisRaw("Horizontal");
        movement.y = Input.GetAxisRaw("Vertical");
        animator.SetFloat("Speed", Mathf.Abs(movement.x));
        if (movement.x > 0)
        {
            gameObject.transform.localScale = new Vector3(-1, 1, 1);
        }
        if (movement.x < 0)
        {
            gameObject.transform.localScale = new Vector3(1, 1, 1);
        }
    }
    void FixedUpdate()
    {
        // movement
        rb.MovePosition(rb.position + movement * moveSpeed * Time.fixedDeltaTime);
    
    }



}
