import torch
import torchaudio
import os
from whisper import Whisper, ModelDimensions

# Load the model from its saved file
model_path = "instance/medium.pt"
model = Whisper()
model.load_state_dict(torch.load(model_path))
