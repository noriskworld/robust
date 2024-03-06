# Import necessary modules
import numpy as np
import scipy.stats as stats
import pandas as pd

def calculate_part_z_scores(lsl=np.nan, usl=np.nan, mu=np.nan, sigma=np.nan, term="short"):
    """Calculates Z scores for a process, considering short-term and long-term capability.

    Args:
        lsl (float, optional): Lower specification limit. Defaults to np.nan.
        usl (float, optional): Upper specification limit. Defaults to np.nan.
        mu (float, optional): Process mean. Defaults to np.nan.
        sigma (float, optional): Process standard deviation. Defaults to np.nan.
        term (str, optional): Indicates whether to calculate short-term or long-term Z scores.
            Valid options are "short" or "long". Defaults to "short".

    Returns:
        tuple: A tuple containing:
            - dpo: Defective parts per opportunity (DPO).
            - z_st: Short-term Z score.
            - z_lt: Long-term Z score.
    Raises:
        ValueError: If both lsl and usl are np.nan.
        ValueError: If the `term` argument is invalid.
    """

    # Validate input arguments
    if term not in ("short", "long"):
        raise ValueError("Invalid term. Must be 'short' or 'long'.")

# Check for invalid combination of lsl and usl
    if np.isnan(lsl) and np.isnan(usl):
        raise ValueError("Both lsl and usl cannot be NaN simultaneously.")


    # Determine sigma for short-term or long-term capability
    sigma_lt = 1.3 * sigma if term == "short" else sigma

    # Calculate DPOs for each specification limit
    dpo_u = 1 - stats.norm.cdf((usl - mu) / sigma_lt) if not np.isnan(usl) else 0
    dpo_l = 1 - stats.norm.cdf((mu - lsl) / sigma_lt) if not np.isnan(lsl) else 0

    # Calculate total DPO and Z scores
    dpo = dpo_u + dpo_l
    z_lt = stats.norm.ppf(1 - dpo, loc=0, scale=1)
    z_st = z_lt + 1.5

    return dpo, z_st

def calculate_assembly_z_scores(parts_data):
    """Calculates assembly Z scores based on data for multiple parts.

    Args:
        parts_data (list or dict or pandas.DataFrame): Data for each part, containing:
            - lsl (float): Lower specification limit.
            - usl (float): Upper specification limit.
            - mu (float): Process mean.
            - sigma (float): Process standard deviation.
            - term (str): Indicates whether to calculate short-term or long-term Z scores.

    Returns:
        tuple: A tuple containing:
            - parts_dpo: List of DPO values for each part.
            - parts_z_st: List of Z scores for each part (short-term or long-term based on 'term').
            - assembly_dpo: DPO for the assembly.
            - assembly_z_st: Z score for the assembly (short-term or long-term based on parts' terms).
    """

    parts_dpo, parts_z_st = [], []

    # Process part data based on its format
    if isinstance(parts_data, list):
        for part in parts_data:
            dpo, z_st = calculate_part_z_scores(**part) 
            parts_dpo.append(dpo)
            parts_z_st.append(z_st)
    elif isinstance(parts_data, dict):
        dpo, z_st = calculate_part_z_scores(**parts_data)
        parts_dpo.append(dpo)
        parts_z_st.append(z_st)
    elif pd and isinstance(parts_data, pd.DataFrame):
        for index, row in parts_data.iterrows():
            dpo, z_st = calculate_part_z_scores(**row.to_dict())
            parts_dpo.append(dpo)
            parts_z_st.append(z_st)
    else:
        raise ValueError("Invalid data format. Must be list, dict, or pandas DataFrame.")

    # Calculate assembly DPO and Z scores
    assembly_dpo = np.mean(parts_dpo)
    assembly_z_lt = stats.norm.ppf(1 - assembly_dpo, loc=0, scale=1)
    assembly_z_st = assembly_z_lt + 1.5

    return parts_dpo, parts_z_st, assembly_dpo, assembly_z_st 

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

