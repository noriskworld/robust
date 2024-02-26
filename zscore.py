# Import necessary modules
import numpy as np
import scipy.stats as stats

# Define a function to calculate short-term and long-term Z-scores based on specification limits and short-term prototype data
def z_short_prototype(lsl=np.nan, usl=np.nan, mu=np.nan, sigma=np.nan):
    # Adjust the standard deviation for long-term capability
    sigma_lt = 1.3 * sigma
    
    # Initialize short-term and long-term defective probabilities above USL to zero
    dpo_u_st = 0
    dpo_u_lt = 0
    
    # Check if the USL is not NaN (i.e., it is provided)
    if not np.isnan(usl):
        # Calculate the probability of defectives above USL for short-term
        dpo_u_st = 1 - stats.norm.cdf((usl - mu) / sigma)
        # Calculate the probability of defectives above USL for long-term, adjusting by 1.5 sigma shift
        dpo_u_lt = 1 - stats.norm.cdf((usl - mu) / sigma_lt - 1.5)
    
    # Initialize short-term and long-term defective probabilities below LSL to zero
    dpo_l_st = 0
    dpo_l_lt = 0
    
    # Check if the LSL is not NaN (i.e., it is provided)
    if not np.isnan(lsl):
        # Calculate the probability of defectives below LSL for short-term
        dpo_l_st = 1 - stats.norm.cdf((mu - lsl) / sigma)
        # Calculate the probability of defectives below LSL for long-term, adjusting by 1.5 sigma shift
        dpo_l_lt = 1 - stats.norm.cdf((mu - lsl) / sigma_lt - 1.5)
    
    # Calculate total defective probability for short-term
    dpo_st = dpo_u_st + dpo_l_st
    # Calculate the Z-score for short-term
    z_st = stats.norm.ppf(1 - dpo_st, loc=0, scale=1)
    
    # Calculate total defective probability for long-term
    dpo_lt = dpo_u_lt + dpo_l_lt
    # Calculate the Z-score for long-term
    z_lt = stats.norm.ppf(1 - dpo_lt, loc=0, scale=1)
    
    # Return the long-term and short-term Z-scores
    return z_lt, z_st

# Define a function to calculate short-term and long-term Z-scores based on specification limits and short-term production data
def z_short_production(lsl=np.nan, usl=np.nan, mu=np.nan, sigma=np.nan):
    # Adjust the standard deviation for long-term capability
    sigma_lt = sigma
    
    # Initialize long-term defective probabilities above USL to zero
    dpo_u_lt = 0
    
    # Check if the USL is not NaN (i.e., it is provided)
    if not np.isnan(usl):
        # Calculate the probability of defectives above USL for long-term, adjusting by 1.5 sigma shift
        dpo_u_lt = 1 - stats.norm.cdf((usl - mu) / sigma_lt - 1.5)
    
    # Initialize long-term defective probabilities below LSL to zero
    dpo_l_lt = 0
    
    # Check if the LSL is not NaN (i.e., it is provided)
    if not np.isnan(lsl):
        # Calculate the probability of defectives below LSL for long-term, adjusting by 1.5 sigma shift
        dpo_l_lt = 1 - stats.norm.cdf((mu - lsl) / sigma_lt - 1.5)
    
    
    # Calculate total defective probability for long-term
    dpo_lt = dpo_u_lt + dpo_l_lt
    # Calculate the Z-score for long-term
    z_lt = stats.norm.ppf(1 - dpo_lt, loc=0, scale=1)
    
    z_st = z_lt + 1.5

    # Return the long-term and short-term Z-scores
    return z_lt, z_st

# Define a function to calculate short-term and long-term Z-scores based on specification limits and long-term production data
def z_long_production(lsl=np.nan, usl=np.nan, mu=np.nan, sigma=np.nan):
    # Adjust the standard deviation for long-term capability
    
    # Initialize long-term defective probabilities above USL to zero
    dpo_u_lt = 0
    
    # Check if the USL is not NaN (i.e., it is provided)
    if not np.isnan(usl):
        # Calculate the probability of defectives above USL for long-term, adjusting by 1.5 sigma shift
        dpo_u_lt = 1 - stats.norm.cdf((usl - mu) / sigma)
    
    # Initialize long-term defective probabilities below LSL to zero
    dpo_l_lt = 0
    
    # Check if the LSL is not NaN (i.e., it is provided)
    if not np.isnan(lsl):
        # Calculate the probability of defectives below LSL for long-term, adjusting by 1.5 sigma shift
        dpo_l_lt = 1 - stats.norm.cdf((mu - lsl) / sigma)
    
    
    # Calculate total defective probability for long-term
    dpo_lt = dpo_u_lt + dpo_l_lt
    # Calculate the Z-score for long-term
    z_lt = stats.norm.ppf(1 - dpo_lt, loc=0, scale=1)
    
    z_st = z_lt + 1.5

    # Return the long-term and short-term Z-scores
    return z_lt, z_st





# Define a function that calculates the short-term Z (Z_st) values for a process
def z_short(lsl=np.nan, usl=np.nan, mu=np.nan, sigma=np.nan):
    # Define a multiplier for sigma to account for short-term capability
    sigma_lt = 1.3 * sigma
    
    # Initialize the proportion of defectives above the Upper Specification Limit (USL)
    dpo_u = 0
    # If the USL is provided (not NaN), calculate the defective proportion above USL
    if not np.isnan(usl):
        dpo_u = 1 - stats.norm.cdf((usl - mu)/sigma_lt)
    
    # Initialize the proportion of defectives below the Lower Specification Limit (LSL)
    dpo_l = 0
    # If the LSL is provided (not NaN), calculate the defective proportion below LSL
    if not np.isnan(lsl):
        dpo_l = 1 - stats.norm.cdf((mu - lsl)/sigma_lt)
    
    # Calculate the total Defective Parts per Opportunity (DPO) by summing the proportions
    dpo = dpo_u + dpo_l
    
    # Calculate the Z short-term (Z_st) value using the inverse of the normal cumulative distribution function
    z_lt = stats.norm.ppf(1-dpo, loc=0, scale=1)
    
    # Return the DPO and Z_st values
    return dpo, z_lt
