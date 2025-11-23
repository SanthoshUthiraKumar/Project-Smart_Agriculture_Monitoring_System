package com.example.agro.DTOs;

public class RecommendationRequestDTO {
    private double nitrogen;
    private double phosphorus;
    private double potassium;
    private double ph;
    private double rainfall;

    // Getters and Setters
    public double getNitrogen() { return nitrogen; }
    public void setNitrogen(double nitrogen) { this.nitrogen = nitrogen; }
    public double getPhosphorus() { return phosphorus; }
    public void setPhosphorus(double phosphorus) { this.phosphorus = phosphorus; }
    public double getPotassium() { return potassium; }
    public void setPotassium(double potassium) { this.potassium = potassium; }
    public double getPh() { return ph; }
    public void setPh(double ph) { this.ph = ph; }
    public double getRainfall() { return rainfall; }
    public void setRainfall(double rainfall) { this.rainfall = rainfall; }
}