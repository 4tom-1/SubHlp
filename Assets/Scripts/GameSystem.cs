using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class GameSystem : MonoBehaviour
{
    Ball currentDraggingBall;
    public ObjectGenarator objectGenarator;
    bool isDragging;
    float ballDistance = 1.0f;
    private int score;
    public TextMeshProUGUI scoreText;
    public LineRenderer lineRenderer;
    List<Ball> removeBalls = new List<Ball>();
    
    public void PlayEffect()
    {
        Instantiate(effect, transform.position, transform.rotation);
    }
    
    // ... existing code ...
} 