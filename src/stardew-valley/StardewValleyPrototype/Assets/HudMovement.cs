using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class HudMovement : MonoBehaviour
{
    public float moveSpeed = 5f;
    public bool Move = false;
    public Rigidbody2D rb;
    Vector2 movement;
    // Update is called once per frame
    private void Update()
    {
        // Input
        movement.x = Input.GetAxisRaw("Horizontal");
        movement.y = Input.GetAxisRaw("Vertical");
       
       
    }
    private void FixedUpdate()
    {
        // movement
        rb.MovePosition(rb.position + movement * moveSpeed * Time.fixedDeltaTime);

    }



}
